import * as twgl from 'twgl.js'
const l10n = require('src/l10n.json')

const icon = "data:image/svg+xml,%3Csvg%20width%3D%22129%22%20height%3D%22129%22%20viewBox%3D%220%200%20129%20129%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M75%2067.1928H80V80.1928H75V67.1928Z%22%20fill%3D%22%239EE7F1%22%2F%3E%3Cpath%20d%3D%22M55.0731%2021.02L70.7722%2030.8701L60.6256%20108.129L43.464%20109.415L55.0731%2021.02Z%22%20fill%3D%22%239EE7F1%22%2F%3E%3Cpath%20d%3D%22M106.059%2046.3074L92.7209%2055.4334L53.5113%2034.7133L54.8128%2021.0354L106.059%2046.3074Z%22%20fill%3D%22%239EE7F1%22%2F%3E%3Cpath%20d%3D%22M102.549%2072.9834L89.2109%2079.3015L50.3659%2061.3893L51.6674%2047.7114L102.549%2072.9834Z%22%20fill%3D%22%239EE7F1%22%2F%3E%3Cpath%20d%3D%22M55.0731%2014L70.7722%2023.8501L60.6256%20101.109L43.464%20102.395L55.0731%2014Z%22%20fill%3D%22%23F19ED2%22%2F%3E%3Cpath%20d%3D%22M106.059%2039.2874L92.7209%2048.4134L53.5113%2027.6933L54.8128%2014.0154L106.059%2039.2874Z%22%20fill%3D%22%23F19ED2%22%2F%3E%3Cpath%20d%3D%22M102.549%2065.9634L89.2109%2072.2814L50.3659%2054.3693L51.6674%2040.6914L102.549%2065.9634Z%22%20fill%3D%22%23F19ED2%22%2F%3E%3Cpath%20d%3D%22M55.0731%2018.212L70.7722%2028.0621L60.6256%20105.321L43.464%20106.607L55.0731%2018.212Z%22%20fill%3D%22white%22%2F%3E%3Cpath%20d%3D%22M106.059%2043.4994L92.7209%2052.6254L53.5113%2031.9053L54.8128%2018.2274L106.059%2043.4994Z%22%20fill%3D%22white%22%2F%3E%3Cpath%20d%3D%22M102.549%2070.1754L89.2109%2076.4935L50.3659%2058.5813L51.6674%2044.9034L102.549%2070.1754Z%22%20fill%3D%22white%22%2F%3E%3Cpath%20d%3D%22M92%2070.1928H97V97.1928H92V70.1928Z%22%20fill%3D%22%23F1DF9E%22%2F%3E%3Cpath%20d%3D%22M69%2014.1928H72V29.1928H69V14.1928Z%22%20fill%3D%22%23F1DF9E%22%2F%3E%3Cpath%20d%3D%22M21%2018.1928H29V52.1928H21V18.1928Z%22%20fill%3D%22%23F1DF9E%22%2F%3E%3Cpath%20d%3D%22M37%2097.1928H47V115.193H37V97.1928Z%22%20fill%3D%22%23F19ED2%22%2F%3E%3Cpath%20d%3D%22M90%2018.1928H100V39.1928H90V18.1928Z%22%20fill%3D%22%23F19ED2%22%2F%3E%3Cpath%20d%3D%22M42%2039.1928H53V64.1928H42V39.1928Z%22%20fill%3D%22%239EE7F1%22%2F%3E%3C%2Fsvg%3E"
const extensionId = "quakeFrag"

const IS_SHADERED = "isQuakeFragmentShadered"
const PATCHES_ID = "__patches_quakefragment";
const patch = (obj, functions) => {
  if (obj[PATCHES_ID]) return;
  obj[PATCHES_ID] = {};
  for (const name in functions) {
    const original = obj[name];
    obj[PATCHES_ID][name] = obj[name];
    if (original) {
      obj[name] = function(...args) {
        const callOriginal = (...ogArgs) => original.call(this, ...ogArgs);
        return functions[name].call(this, callOriginal, ...args);
      };
    } else {
      obj[name] = function (...args) {
        return functions[name].call(this, () => {}, ...args);
      }
    }
  }
}
const unpatch = (obj) => {
  if (!obj[PATCHES_ID]) return;
  for (const name in obj[PATCHES_ID]) {
    obj[name] = obj[PATCHES_ID][name];
  }
  delete obj[PATCHES_ID];
}

const vertexShaderSource = `
#version 300 es
#ifdef GL_ES
precision mediump float;
#endif

#ifdef DRAW_MODE_line
uniform vec2 u_stageSize;
in vec2 a_lineThicknessAndLength;
in vec4 a_penPoints;
in vec4 a_lineColor;

out vec4 v_lineColor;
out float v_lineThickness;
out float v_lineLength;
out vec4 v_penPoints;

// Add this to divisors to prevent division by 0, which results in NaNs propagating through calculations.
// Smaller values can cause problems on some mobile devices.
const float epsilon = 1e-3;
#endif

#if !(defined(DRAW_MODE_line) || defined(DRAW_MODE_background))
uniform mat4 u_projectionMatrix;
uniform mat4 u_modelMatrix;
in vec2 a_texCoord;
#endif

in vec2 a_position;

out vec2 vUv;

void main() {
	#ifdef DRAW_MODE_line
	// Calculate a rotated ("tight") bounding box around the two pen points.
	// Yes, we're doing this 6 times (once per vertex), but on actual GPU hardware,
	// it's still faster than doing it in JS combined with the cost of uniformMatrix4fv.

	// Expand line bounds by sqrt(2) / 2 each side-- this ensures that all antialiased pixels
	// fall within the quad, even at a 45-degree diagonal
	vec2 position = a_position;
	float expandedRadius = (a_lineThicknessAndLength.x * 0.5) + 1.4142135623730951;

	// The X coordinate increases along the length of the line. It's 0 at the center of the origin point
	// and is in pixel-space (so at n pixels along the line, its value is n).
	vUv.x = mix(0.0, a_lineThicknessAndLength.y + (expandedRadius * 2.0), a_position.x) - expandedRadius;
	// The Y coordinate is perpendicular to the line. It's also in pixel-space.
	vUv.y = ((a_position.y - 0.5) * expandedRadius) + 0.5;

	position.x *= a_lineThicknessAndLength.y + (2.0 * expandedRadius);
	position.y *= 2.0 * expandedRadius;

	// 1. Center around first pen point
	position -= expandedRadius;

	// 2. Rotate quad to line angle
	vec2 pointDiff = a_penPoints.zw;
	// Ensure line has a nonzero length so it's rendered properly
	// As long as either component is nonzero, the line length will be nonzero
	// If the line is zero-length, give it a bit of horizontal length
	pointDiff.x = (abs(pointDiff.x) < epsilon && abs(pointDiff.y) < epsilon) ? epsilon : pointDiff.x;
	// The "normalized" vector holds rotational values equivalent to sine/cosine
	// We're applying the standard rotation matrix formula to the position to rotate the quad to the line angle
	// pointDiff can hold large values so we must divide by u_lineLength instead of calling GLSL's normalize function:
	// https://asawicki.info/news_1596_watch_out_for_reduced_precision_normalizelength_in_opengl_es
	vec2 normalized = pointDiff / max(a_lineThicknessAndLength.y, epsilon);
	position = mat2(normalized.x, normalized.y, -normalized.y, normalized.x) * position;

	// 3. Translate quad
	position += a_penPoints.xy;

	// 4. Apply view transform
	position *= 2.0 / u_stageSize;
	gl_Position = vec4(position, 0, 1);

	v_lineColor = a_lineColor;
	v_lineThickness = a_lineThicknessAndLength.x;
	v_lineLength = a_lineThicknessAndLength.y;
	v_penPoints = a_penPoints;
	#elif defined(DRAW_MODE_background)
	gl_Position = vec4(a_position * 2.0, 0, 1);
	#else
	gl_Position = u_projectionMatrix * u_modelMatrix * vec4(a_position, 0, 1);
	vUv = a_texCoord;
	#endif
}
    `

const fragmentShaderSource = `
#version 300 es
#ifdef GL_ES
precision mediump float;
#endif

in vec2 vUv;
out vec4 fragColor;
uniform sampler2D tDiffuse;
uniform float time;

uniform vec4 u_color;

void main() {
  fragColor = texture(tDiffuse, vUv) * u_color;
  fragColor.rg *= sin(time);
}
`

class QuakeFragment {
  constructor(runtime) {
    window.TEST = this

    this.runtime = runtime
    if (!this.runtime.QuakeManager) this.runtime.QuakeManager = {}

    this.runtime.QuakeManager.loadedShaders = []
    this.QuakeManager = this.runtime.QuakeManager

    this.gl = runtime.renderer._gl
    this.autoReRender = true

    //Thanks obviousalexc :3
    //https://github.com/Pen-Group/extensions/blob/main/extensions/ShadedStamps/extension.js#L121
    this.runtime.renderer._drawThese = (drawables, drawMode, projection, opts = {}) => {
      const gl = runtime.renderer._gl;
      let currentShader = null;
  
      const framebufferSpaceScaleDiffers = (
          'framebufferWidth' in opts && 'framebufferHeight' in opts &&
          opts.framebufferWidth !== runtime.renderer._nativeSize[0] && opts.framebufferHeight !== runtime.renderer._nativeSize[1]
      );
  
      const numDrawables = drawables.length;
      for (let drawableIndex = 0; drawableIndex < numDrawables; ++drawableIndex) {
          const drawableID = drawables[drawableIndex];
  
          // If we have a filter, check whether the ID fails
          if (opts.filter && !opts.filter(drawableID)) continue;
  
          const drawable = runtime.renderer._allDrawables[drawableID];
          /** @todo check if drawable is inside the viewport before anything else */
  
          // Hidden drawables (e.g., by a "hide" block) are not drawn unless
          // the ignoreVisibility flag is used (e.g. for stamping or touchingColor).
          if (!drawable.getVisible() && !opts.ignoreVisibility) continue;
  
          // drawableScale is the "framebuffer-pixel-space" scale of the drawable, as percentages of the drawable's
          // "native size" (so 100 = same as skin's "native size", 200 = twice "native size").
          // If the framebuffer dimensions are the same as the stage's "native" size, there's no need to calculate it.
          const drawableScale = framebufferSpaceScaleDiffers ? [
              drawable.scale[0] * opts.framebufferWidth / runtime.renderer._nativeSize[0],
              drawable.scale[1] * opts.framebufferHeight / runtime.renderer._nativeSize[1]
          ] : drawable.scale;
  
          // If the skin or texture isn't ready yet, skip it.
          if (!drawable.skin || !drawable.skin.getTexture(drawableScale)) continue;
  
          // Skip private skins, if requested.
          if (opts.skipPrivateSkins && drawable.skin.private) continue;
  
          let uniforms = {};
  
          let effectBits = drawable.enabledEffects;
          effectBits &= Object.prototype.hasOwnProperty.call(opts, 'effectMask') ? opts.effectMask : effectBits;
  
          const drawableShader = runtime.QuakeManager.loadedShaders[drawable.QuakeFragment?.shader]
          const newShader = drawableShader ? drawableShader.programInfo : runtime.renderer._shaderManager.getShader(drawMode, effectBits)
  
          // Manually perform region check. Do not create functions inside a
          // loop.
          // ! no
          if (runtime.renderer._regionId !== newShader) {
            runtime.renderer._doExitDrawRegion();
            runtime.renderer._regionId = newShader;
  
              currentShader = newShader;
              gl.useProgram(currentShader.program);
              twgl.setBuffersAndAttributes(gl, currentShader, runtime.renderer._bufferInfo);
              Object.assign(uniforms, {
                  u_projectionMatrix: projection
              });
          }
  
          Object.assign(uniforms,
              drawable.skin.getUniforms(drawableScale),
              drawable.getUniforms());
  
          // Apply extra uniforms after the Drawable's, to allow overwriting.
          if (opts.extraUniforms) {
              Object.assign(uniforms, opts.extraUniforms);
          }

          if (drawableShader) {
            drawable.QuakeFragment.uniforms.time = this.runtime.ioDevices.clock.projectTimer()
            Object.assign(uniforms, drawable.QuakeFragment.uniforms)
          }
  
          if (uniforms.u_skin || drawable.QuakeFragment.uniforms.tDiffuse) {
            twgl.setTextureParameters(
                gl, uniforms.u_skin ? uniforms.u_skin : drawable.QuakeFragment.uniforms.tDiffuse, {
                    minMag: drawable.skin.useNearest(drawableScale, drawable) ? gl.NEAREST : gl.LINEAR
                }
            );
          }
  
          twgl.setUniforms(currentShader, uniforms);
          twgl.drawBufferInfo(gl, runtime.renderer._bufferInfo, gl.TRIANGLES);
      }
  
      runtime.renderer._regionId = null;
    };

    this.runtime.renderer.ext_quakefragment = this
    patch(this.runtime.renderer, {
      draw(og) {
        og()
        this.dirty = this.ext_quakefragment.autoReRender
      },
    })

    const newL10n = {};
    for (const lang in l10n) {
      if (l10n.hasOwnProperty(lang)) {
        newL10n[lang] = {};
        for (const key in l10n[lang]) {
          if (l10n[lang].hasOwnProperty(key)) {
            newL10n[lang][`${extensionId}.${key}`] = l10n[lang][key];
          }
        }
      }
    }

    console.log(newL10n)

    this._formatMessage = runtime.getFormatMessage(newL10n)
  }
  fm(id) {
    return this._formatMessage({
      id: `${extensionId}.${id}`,
      default: id,
      description: id,
    })
  }
  getInfo() {
    return {
      id: "quakefrag",
      name: "Quake Fragment",
      color1: "#6645F6",
      color2: "#5237c5",
      color3: "#6645F6",
      blockIconURI: icon,
      menuIconURI: icon,
      blocks: [
        "---",
        {
          opcode: "setAutoReRender",
          blockType: Scratch.BlockType.COMMAND,
          text: this.fm("[SHOULD] auto re-render"),
          arguments: {
            SHOULD: {
              type: Scratch.ArgumentType.STRING,
              menu: "SHOULD_MENU"
            },
          },
        },
        {
          opcode: "removeShader",
          blockType: Scratch.BlockType.COMMAND,
          text: this.fm("Remove [SHADER]"),
          arguments: {
            SHADER: {
              type: Scratch.ArgumentType.STRING,
              menu: "SHADER_MENU"
            },
          },
        },
        "---",
        {
          opcode: "applyShader",
          blockType: Scratch.BlockType.COMMAND,
          text: this.fm("Apply [SHADER] to [TARGET]"),
          arguments: {
            SHADER: {
              type: Scratch.ArgumentType.STRING,
              menu: "SHADER_MENU"
            },
            TARGET: {
              type: Scratch.ArgumentType.STRING,
              menu: "DRAWABLES_MENU",
            },
          },
        },
        {
          opcode: "detachShader",
          blockType: Scratch.BlockType.COMMAND,
          text: this.fm("Detach [SHADER] from [TARGET]"),
          arguments: {
            SHADER: {
              type: Scratch.ArgumentType.STRING,
              menu: "SHADER_MENU"
            },
            TARGET: {
              type: Scratch.ArgumentType.STRING,
              menu: "DRAWABLES_MENU",
            },
          },
        },
      ],
      menus: {
        DRAWABLES_MENU: {
          acceptReporters: true,
          items: "_getDrawablesMenu",
        },
        SHADER_MENU: {
          acceptReporters: true,
          items: "_shaderList",
        },
        SHOULD_MENU: {
          items: [
            {
              text: this.fm('Enable'),
              value: "true"
            },
            {
              text: this.fm('Disable'),
              value: "false"
            },
        ]
        }
      },
    }
  }

  setAutoReRender({ SHOULD }) {
    this.autoReRender = SHOULD == "true" ? true : false
  }

  removeShader({ SHADER }) {
    const shaderInfo = this.QuakeManager.loadedShaders[SHADER];
    if (!shaderInfo) {
      console.error(`Shader ${SHADER} not found.`);
      return;
    }
  
    const shaderProgram = shaderInfo.programInfo.program;
    const gl = this.gl
  
    // Retrieve attached shaders
    const shaders = gl.getAttachedShaders(shaderProgram);
    shaders.forEach(shader => {
      gl.detachShader(shaderProgram, shader);
      gl.deleteShader(shader);
    });
  
    // Delete the program
    gl.deleteProgram(shaderProgram);
  
    // Remove the shader from the loaded shaders
    delete this.QuakeManager.loadedShaders[SHADER];
  
    // Clean up any references to the shader in drawables
    for (let i = 0; i < this.runtime.renderer._allDrawables.length; i++) {
      const drawable = this.runtime.renderer._allDrawables[i];
      if (drawable.QuakeFragment?.shader === SHADER) {
        delete drawable.QuakeFragment;
      }
    }
  }  

  applyShader({ SHADER, TARGET }, util) {
    const target = this._getTargetByIdOrName(TARGET, util)
    const drawable = this.runtime.renderer._allDrawables[target.drawableID]

    let drawableShader = this.QuakeManager.loadedShaders[SHADER]

    if (!drawableShader) {
      drawableShader = {}

      const asset = this.runtime.getGandiAssetContent(SHADER);
      if (asset) {
        drawableShader.source = asset.decodeText();
      }

      const programInfo = twgl.createProgramInfo(this.gl, [vertexShaderSource, SHADER === "__example__" ? fragmentShaderSource : drawableShader.source])
      this.gl.useProgram(programInfo.program)
      twgl.setBuffersAndAttributes(this.gl, programInfo.program, this.runtime.renderer._bufferInfo);
      drawableShader.programInfo = programInfo

      this.QuakeManager.loadedShaders[SHADER] = drawableShader
    }

    if (!drawable.QuakeFragment) {
      drawable.QuakeFragment = {}
    }

    drawable.QuakeFragment.shader = SHADER
    drawable.QuakeFragment.uniforms = {
      u_color: [Math.random(), Math.random(), Math.random(), 1],
    }

    this.runtime.renderer.dirty = true
  }

  detachShader({ SHADER, TARGET }, util) {
    const target = this._getTargetByIdOrName(TARGET, util)
    const drawable = this.runtime.renderer._allDrawables[target.drawableID]
    if (drawable.QuakeFragment?.shader === SHADER) {
      delete drawable.QuakeFragment
    }
  }

  _getTargetByIdOrName(name, util) {
    if (name === '__myself__') return util.target
    if (name === '__stage__') return this.runtime.getTargetForStage()
    let target = this.runtime.getSpriteTargetByName(name)
    if (!target) {
      target = this.runtime.getTargetById(name)
      if (!target) return null
    }
    return target
  }

  _getSpriteMenu() {
    const { targets } = this.runtime
    // 跳过舞台
    const menu = targets
      .filter((target) => !target.isStage && target.isOriginal)
      .map((target) => ({
        text: target.sprite.name,
        value: target.sprite.name,
      }))
    // 空检查
    if (menu.length === 0) {
      menu.push({
        text: "-",
        value: "empty",
      })
    }
    return menu
  }

  _getDrawablesMenu() {
    const menu = this._getSpriteMenu()
    if (!this.runtime._editingTarget) return menu

    const editingTargetName = this.runtime._editingTarget.sprite.name

    const index = menu.findIndex((item) => item.value === editingTargetName)
    if (index !== -1) {
      menu.splice(index, 1)
    }

    menu.unshift({
      text: this.fm("me"),
      value: "__myself__",
    },
    {
      text: this.fm("stage"),
      value: "__stage__",
    })
    return menu
  }

  _shaderList() {
    const list = this.runtime
      .getGandiAssetsFileList("glsl")
      .map((item) => item.fullName);
    list.push({
      text: this.fm("example"),
      value: "__example__",
    });

    return list;
  }

  // thanks stackoverflow
  // https://stackoverflow.com/a/18804083
  __getCanvasFromTexture(gl, texture, width, height, dx, dy) {
    const framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

    const data = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);

    gl.deleteFramebuffer(framebuffer);

    const imageData = new ImageData(width, height);
    imageData.data.set(data);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");

    context.putImageData(imageData, dx, dy);

    return canvas;
  }

  //Thanks CST :3
  //https://github.com/CST1229/turbowarp-extensions/blob/3d/extensions/CST1229/3d.js
  __getCanvasFromSkin(skin) {
    const emptyCanvas = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      return canvas;
    }

    switch (skin.constructor) {
      case this.runtime.renderer.exports.BitmapSkin: {
        if (skin._textureSize[0] < 1 || skin._textureSize[1] < 1)
          return emptyCanvas();
        return this.__getCanvasFromTexture(
          this.runtime.renderer.gl,
          skin.getTexture(),
          skin._textureSize[0] * 2,
          skin._textureSize[1] * 2,
          skin._textureSize[0] / 2,
          skin._textureSize[1] / 2
        );
      }
      case this.runtime.renderer.exports.SVGSkin: {
        // code copy-pasted from scratch-render
        const INDEX_OFFSET = 8;

        const textureScale = 200;

        const scaleMax = textureScale ? Math.max(Math.abs(textureScale), Math.abs(textureScale)) : 100;
        const requestedScale = Math.min(scaleMax / 100, skin._maxTextureScale);
        const mipLevel = Math.max(Math.ceil(Math.log2(requestedScale)) + INDEX_OFFSET, 0);
        const mipScale = Math.pow(2, mipLevel - INDEX_OFFSET);

        const sizeX = Math.ceil(skin._size[0] * mipScale);
        const sizeY = Math.ceil(skin._size[1] * mipScale)
        if (sizeX < 1 || sizeY < 1)
          return emptyCanvas();

        return this.__getCanvasFromTexture(
          this.runtime.renderer.gl,
          skin.getTexture([textureScale, textureScale]),
          sizeX,
          sizeY,
          0,
          0
        );
      }
      default:
        console.error("Could not get skin image data:", skin);
        throw new TypeError("Could not get skin image data");
    }
  }
}

window.tempExt = {
  Extension: QuakeFragment,
  info: {
    name: "quakefragment.extensionName",
    description: "quakefragment.description",
    extensionId: "quakefragment",
    //iconURL: cover,
    insetIconURL: icon,
    featured: true,
    disabled: false,
    collaboratorList: [
      {
        collaborator: 'Fath11@Cocrea',
        collaboratorURL: 'https://cocrea.world/@Fath11',
      },
    ],
  },
  l10n: {
    "zh-cn": {
      "quakefragment.extensionName": "Quake Fragment",
      "quakefragment.description": "Better way to load fragment shaders",
    },
    en: {
      "quakefragment.extensionName": "Quake Fragment",
      "quakefragment.description": "Better way to load fragment shaders",
    },
  },
}
