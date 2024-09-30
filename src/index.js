import * as twgl from 'twgl.js'
const l10n = require('src/l10n.json')

const icon = `data:image/svg+xml;base64,${btoa(`
<svg width="129" height="129" viewBox="0 0 129 129" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M50.5773 90.704C48.2193 92.7189 45.0688 93.7263 41.1259 93.7263C38.1109 93.7263 35.5209 93.0745 33.3562 91.7707C31.1528 90.6646 29.3746 89.2226 28.0218 87.4448C26.3596 85.5879 25.2579 83.1584 24.7167 80.1559C24.0982 77.1534 23.7889 71.4052 23.7889 62.9114C23.7889 54.4174 24.0982 48.6298 24.7167 45.5483C25.2579 42.6248 26.3596 40.2347 28.0218 38.3779C29.3746 36.6 31.1528 35.1186 33.3562 33.9334C35.5209 32.7877 38.1109 32.1753 41.1259 32.0963C44.1798 32.1753 46.8277 32.7877 49.0697 33.9334C51.1958 35.1186 52.8966 36.6 54.1722 38.3779C55.8344 40.2347 56.9748 42.6248 57.5933 45.5483C58.1731 48.6298 58.463 54.4174 58.463 62.9114C58.463 72.0373 58.0571 78.062 57.2454 80.9855L47.3882 72.9855L39.7924 81.9337L50.5773 90.704ZM61.0723 99.2967L71.7412 108.067L79.337 99.0597L68.2042 89.9929C69.3639 88.0176 70.195 85.2522 70.6976 81.6966C71.0841 78.1411 71.2774 71.8793 71.2774 62.9114C71.2774 52.8767 71.0261 46.1607 70.5236 42.7631C69.9824 39.3655 68.9967 36.6199 67.5664 34.526C65.595 30.5358 62.3866 26.9803 57.9411 23.8593C53.4571 20.6988 47.852 19.079 41.1259 19C34.4772 19.079 28.9301 20.6988 24.4847 23.8593C19.962 26.9803 16.6763 30.5358 14.6276 34.526C13.3519 36.6199 12.4049 39.3655 11.7864 42.7631C11.2066 46.1607 10.9166 52.8767 10.9166 62.9114C10.9166 72.7879 11.2066 79.4646 11.7864 82.9411C12.0956 84.7979 12.4822 86.3386 12.9461 87.5633C13.4486 88.7485 14.0091 89.9929 14.6276 91.2967C16.6763 95.2868 19.962 98.8028 24.4847 101.845C28.9301 105.005 34.4772 106.665 41.1259 106.823C49.437 106.665 56.0857 104.156 61.0723 99.2967Z" fill="#E651E9"/>
<path d="M56.5147 90.704C54.1568 92.7189 51.0063 93.7263 47.0634 93.7263C44.0484 93.7263 41.4584 93.0745 39.2937 91.7707C37.0903 90.6646 35.3121 89.2226 33.9593 87.4448C32.2971 85.5879 31.1954 83.1584 30.6542 80.1559C30.0357 77.1534 29.7264 71.4052 29.7264 62.9114C29.7264 54.4174 30.0357 48.6298 30.6542 45.5483C31.1954 42.6248 32.2971 40.2347 33.9593 38.3779C35.3121 36.6 37.0903 35.1186 39.2937 33.9334C41.4584 32.7877 44.0484 32.1753 47.0634 32.0963C50.1173 32.1753 52.7652 32.7877 55.0072 33.9334C57.1332 35.1186 58.8341 36.6 60.1097 38.3779C61.7719 40.2347 62.9123 42.6248 63.5308 45.5483C64.1106 48.6298 64.4005 54.4174 64.4005 62.9114C64.4005 72.0373 63.9946 78.062 63.1829 80.9855L53.3257 72.9855L45.7299 81.9337L56.5147 90.704ZM67.0098 99.2967L77.6787 108.067L85.2749 99.0597L74.1417 89.9929C75.3014 88.0176 76.1324 85.2522 76.6351 81.6966C77.0216 78.1411 77.2148 71.8793 77.2148 62.9114C77.2148 52.8767 76.9636 46.1607 76.4611 42.7631C75.9199 39.3655 74.9342 36.6199 73.5039 34.526C71.5325 30.5358 68.324 26.9803 63.8786 23.8593C59.3946 20.6988 53.7895 19.079 47.0634 19C40.4147 19.079 34.8676 20.6988 30.4222 23.8593C25.8995 26.9803 22.6138 30.5358 20.5651 34.526C19.2894 36.6199 18.3424 39.3655 17.7239 42.7631C17.1441 46.1607 16.8541 52.8767 16.8541 62.9114C16.8541 72.7879 17.1441 79.4646 17.7239 82.9411C18.0331 84.7979 18.4196 86.3386 18.8836 87.5633C19.3861 88.7485 19.9466 89.9929 20.5651 91.2967C22.6138 95.2868 25.8995 98.8028 30.4222 101.845C34.8676 105.005 40.4147 106.665 47.0634 106.823C55.3744 106.665 62.0232 104.156 67.0098 99.2967Z" fill="#15F6EA"/>
<path d="M53.546 90.704C51.188 92.7189 48.0376 93.7263 44.0947 93.7263C41.0796 93.7263 38.4897 93.0745 36.325 91.7707C34.1216 90.6646 32.3434 89.2226 30.9905 87.4448C29.3283 85.5879 28.2266 83.1584 27.6854 80.1559C27.0669 77.1534 26.7577 71.4052 26.7577 62.9114C26.7577 54.4174 27.0669 48.6298 27.6854 45.5483C28.2266 42.6248 29.3283 40.2347 30.9905 38.3779C32.3434 36.6 34.1216 35.1186 36.325 33.9334C38.4897 32.7877 41.0796 32.1753 44.0947 32.0963C47.1486 32.1753 49.7965 32.7877 52.0385 33.9334C54.1645 35.1186 55.8654 36.6 57.141 38.3779C58.8032 40.2347 59.9436 42.6248 60.5621 45.5483C61.1419 48.6298 61.4318 54.4174 61.4318 62.9114C61.4318 72.0373 61.0259 78.062 60.2141 80.9855L50.357 72.9855L42.7611 81.9337L53.546 90.704ZM64.041 99.2967L74.7099 108.067L82.3058 99.0597L71.173 89.9929C72.3327 88.0176 73.1637 85.2522 73.6663 81.6966C74.0529 78.1411 74.2461 71.8793 74.2461 62.9114C74.2461 52.8767 73.9949 46.1607 73.4923 42.7631C72.9511 39.3655 71.9654 36.6199 70.5352 34.526C68.5637 30.5358 65.3553 26.9803 60.9099 23.8593C56.4259 20.6988 50.8208 19.079 44.0947 19C37.446 19.079 31.8989 20.6988 27.4535 23.8593C22.9308 26.9803 19.6451 30.5358 17.5963 34.526C16.3207 36.6199 15.3736 39.3655 14.7551 42.7631C14.1753 46.1607 13.8854 52.8767 13.8854 62.9114C13.8854 72.7879 14.1753 79.4646 14.7551 82.9411C15.0644 84.7979 15.4509 86.3386 15.9148 87.5633C16.4173 88.7485 16.9778 89.9929 17.5963 91.2967C19.6451 95.2868 22.9308 98.8028 27.4535 101.845C31.8989 105.005 37.446 106.665 44.0947 106.823C52.4057 106.665 59.0544 104.156 64.041 99.2967Z" fill="white"/>
<path d="M69.3021 75.6364H91.0729V78.6704H69.3021V75.6364Z" fill="#FAFF00"/>
<path d="M6.95833 59.4545H13.8854V67.5454H6.95833V59.4545Z" fill="#E651E9"/>
<path d="M67.3229 37.2045H89.0937V42.2613H67.3229V37.2045Z" fill="#E651E9"/>
<path d="M66.3333 88.7841H98V96.875H66.3333V88.7841Z" fill="#15F6EA"/>
<path d="M20.8125 100.92H43.5729V105.977H20.8125V100.92Z" fill="#15F6EA"/>
<path d="M3 88.7841H24.7708V91.8181H3V88.7841Z" fill="#FAFF00"/>
<path d="M6.95833 27.0909H38.625V35.1818H6.95833V27.0909Z" fill="#FAFF00"/>
<rect x="98.0383" y="28" width="10.5921" height="42.3684" fill="#15F6EA"/>
<rect x="82.6316" y="54.9617" width="10.5921" height="42.3684" transform="rotate(-90 82.6316 54.9617)" fill="#15F6EA"/>
<rect x="94.4067" y="31.6316" width="10.5921" height="42.3684" fill="#E651E9"/>
<rect x="79" y="58.5933" width="10.5921" height="42.3684" transform="rotate(-90 79 58.5933)" fill="#E651E9"/>
<rect x="95.6172" y="29.2105" width="10.5921" height="42.3684" fill="white"/>
<rect x="80.2105" y="56.1723" width="10.5921" height="42.3684" transform="rotate(-90 80.2105 56.1723)" fill="white"/>
</svg>
`
  )}`
const extensionId = "betterquake"

const PATCHES_ID = "__patches_betterquake";
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

class BetterQuake {
  constructor(runtime) {
    window.TEST = this

    this.runtime = runtime
    if (!this.runtime.QuakeManager) this.runtime.QuakeManager = {}

    this.runtime.QuakeManager.loadedShaders = []
    this.runtime.QuakeManager.textures = []
    this.QuakeManager = this.runtime.QuakeManager

    this.gl = runtime.renderer._gl
    this.autoReRender = true

    //for compatibility with Spine skins
    const skinClass = this.runtime.renderer.getSkinClass()

    const oldDrawThese = this.runtime.renderer._drawThese
    this.newDrawThese = (drawables, drawMode, projection, opts = {}) => {
      const renderer = this.runtime.renderer
      const gl = renderer._gl;
      let currentShader = null;
      if (renderer.spineManager) {
        renderer.spineManager.updateTime();
      }
    
      const framebufferSpaceScaleDiffers = (
          'framebufferWidth' in opts && 'framebufferHeight' in opts &&
          opts.framebufferWidth !== renderer._nativeSize[0] && opts.framebufferHeight !== renderer._nativeSize[1]
      );
    
      const startIndex = Math.max(0, opts.startIndex ?? 0);
      const endIndex = Math.min(drawables.length, opts.endIndex ?? drawables.length);
    
      for (let drawableIndex = startIndex; drawableIndex < endIndex; ++drawableIndex) {
          const drawableID = drawables[drawableIndex];
    
          // If we have a filter, check whether the ID fails
          if (opts.filter && !opts.filter(drawableID)) continue;
    
          const drawable = renderer._allDrawables[drawableID];
          /** @todo check if drawable is inside the viewport before anything else */
    
          // Hidden drawables (e.g., by a "hide" block) are not drawn unless
          // the ignoreVisibility flag is used (e.g. for stamping or touchingColor).
          if (!drawable.getVisible() && !opts.ignoreVisibility) continue;
    
          // drawableScale is the "framebuffer-pixel-space" scale of the drawable, as percentages of the drawable's
          // "native size" (so 100 = same as skin's "native size", 200 = twice "native size").
          // If the framebuffer dimensions are the same as the stage's "native" size, there's no need to calculate it.
          const drawableScale = framebufferSpaceScaleDiffers ? [
              drawable.scale[0] * opts.framebufferWidth / renderer._nativeSize[0],
              drawable.scale[1] * opts.framebufferHeight / renderer._nativeSize[1]
          ] : drawable.scale;
    
          // If the skin or texture isn't ready yet, skip it.
          if (!drawable.skin || !drawable.skin.getTexture(drawableScale)) continue;
    
          // if the skin is not a Skin, we assume its an instance of SpineSkin
          // todo: replace with the actual SpineSkin class
          if (!drawable.skin instanceof skinClass) {
              renderer._doExitDrawRegion(); // exit any draw region
              drawable.skin.render(drawable, drawableScale, projection, opts); // draw spine object
              // reset blend mode because spine renderer changes it
              // NOTE -  change blend is a costly operation, so we only do it when necessary
              gl.enable(gl.BLEND);
              continue;
          }
    
          const uniforms = {};
    
          let effectBits = drawable.enabledEffects;
          effectBits &= Object.prototype.hasOwnProperty.call(opts, 'effectMask') ? opts.effectMask : effectBits;
          if (drawable.enabledExtraEffect !== 0) {
              effectBits |= drawable.enabledExtraEffect;
              drawable.injectExtraEffectUniforms(uniforms);
          }
    
          const drawableShader = runtime.QuakeManager.loadedShaders[drawable.BetterQuake?.shader]
          const newShader = drawableShader ? drawableShader.programInfo : renderer._shaderManager.getShader(drawMode, effectBits)
    
          // Manually perform region check. Do not create functions inside a
          // loop.
          if (renderer._regionId !== newShader) {
              renderer._doExitDrawRegion();
              renderer._regionId = newShader;
    
              currentShader = newShader;
              gl.useProgram(currentShader.program);
              twgl.setBuffersAndAttributes(gl, currentShader, renderer._bufferInfo);
              Object.assign(uniforms, {
                  u_projectionMatrix: projection
              });
          }
          // if drawable has its own project, use it
          if (drawable.customizedProjection && drawMode !== 'straightAlpha') {
              Object.assign(uniforms, {
                  u_projectionMatrix: drawable.customizedProjection
              });
          } else {
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

          // Apply BetterQuake uniforms
          if (drawableShader) {
            drawable.BetterQuake.uniforms.time = this.runtime.ioDevices.clock.projectTimer()
            Object.assign(uniforms, drawable.BetterQuake.uniforms)
          }
    
          if (uniforms.u_skin || drawable.BetterQuake.uniforms.tDiffuse) {
            //should bothh uniforms be available to use?
            //the only reason i want to keep tDiffuse is for compatibility with GandiQuake
            twgl.setTextureParameters(
                gl, uniforms.u_skin ? uniforms.u_skin : drawable.BetterQuake.uniforms.tDiffuse, {
                    minMag: drawable.skin.useNearest(drawableScale, drawable) ? gl.NEAREST : gl.LINEAR
                }
            );
          }
    
          twgl.setUniforms(currentShader, uniforms);
          twgl.drawBufferInfo(gl, renderer._bufferInfo, gl.TRIANGLES);
      }
    
      renderer._regionId = null;
      renderer.dirty = this.autoReRender
    }
    this.runtime.renderer._drawThese = this.newDrawThese

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
      id: "betterquake",
      name: "Better Quake",
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
        "---",
        {
          opcode: "allLoadedShaders",
          blockType: Scratch.BlockType.REPORTER,
          text: this.fm("All loaded shaders"),
          arguments: {},
          disableMonitor: true,
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
        {
          opcode: "reloadShader",
          blockType: Scratch.BlockType.COMMAND,
          text: this.fm("Reload [SHADER]"),
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
        "---" + this.fm("Uniforms"),
        {
          opcode: "setNumber",
          blockType: Scratch.BlockType.COMMAND,
          text: this.fm("Set number [UNIFORM] of [TARGET] to [VALUE]"),
          arguments: {
            UNIFORM: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "Uniform"
            },
            TARGET: {
              type: Scratch.ArgumentType.STRING,
              menu: "DRAWABLES_MENU",
            },
            VALUE: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 0
            },
          },
        },
        {
          opcode: "setVec2",
          blockType: Scratch.BlockType.COMMAND,
          text: this.fm("Set vector 2 [UNIFORM] of [TARGET] to [VALUE1][VALUE2]"),
          arguments: {
            UNIFORM: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "Uniform"
            },
            TARGET: {
              type: Scratch.ArgumentType.STRING,
              menu: "DRAWABLES_MENU",
            },
            VALUE1: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 0
            },
            VALUE2: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 0
            },
          },
        },
        {
          opcode: "setVec3",
          blockType: Scratch.BlockType.COMMAND,
          text: this.fm("Set vector 3 [UNIFORM] of [TARGET] to [VALUE1][VALUE2][VALUE3]"),
          arguments: {
            UNIFORM: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "Uniform"
            },
            TARGET: {
              type: Scratch.ArgumentType.STRING,
              menu: "DRAWABLES_MENU",
            },
            VALUE1: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 0
            },
            VALUE2: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 0
            },
            VALUE3: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 0
            },
          },
        },
        {
          opcode: "setVec4",
          blockType: Scratch.BlockType.COMMAND,
          text: this.fm("Set vector 4 [UNIFORM] of [TARGET] to [VALUE1][VALUE2][VALUE3][VALUE4]"),
          arguments: {
            UNIFORM: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "Uniform"
            },
            TARGET: {
              type: Scratch.ArgumentType.STRING,
              menu: "DRAWABLES_MENU",
            },
            VALUE1: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 0
            },
            VALUE2: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 0
            },
            VALUE3: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 0
            },
            VALUE4: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 0
            },
          },
        },
        {
          opcode: "setMatrix",
          blockType: Scratch.BlockType.COMMAND,
          text: this.fm("Set matrix [UNIFORM] of [TARGET] to [MATRIX]"),
          arguments: {
            UNIFORM: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "Uniform"
            },
            TARGET: {
              type: Scratch.ArgumentType.STRING,
              menu: "DRAWABLES_MENU",
            },
            MATRIX: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "[[], []]"
            }
          },
        },
        {
          opcode: "setTexture",
          blockType: Scratch.BlockType.COMMAND,
          text: this.fm("Set texture [UNIFORM] of [TARGET] to [TEXTURE]"),
          arguments: {
            UNIFORM: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "Uniform"
            },
            TARGET: {
              type: Scratch.ArgumentType.STRING,
              menu: "DRAWABLES_MENU",
            },
            TEXTURE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "Scratch Cat"
            },
          },
        },
        "---" + this.fm("Textures"),
        {
          opcode: "allTextures",
          blockType: Scratch.BlockType.REPORTER,
          text: this.fm("All textures"),
          arguments: {},
          disableMonitor: true,
        },
        {
          opcode: "deleteAllTextures",
          blockType: Scratch.BlockType.COMMAND,
          text: this.fm("Delete all textures"),
          arguments: {},
        },
        {
          opcode: "deleteTexture",
          blockType: Scratch.BlockType.COMMAND,
          text: this.fm("Delete texture called [NAME]"),
          arguments: {
            NAME: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "Scratch Cat"
            },
          },
        },
        {
          opcode: "createUpdateTexture",
          blockType: Scratch.BlockType.COMMAND,
          text: this.fm("Create/Update texture called [NAME] with [TEXTURE]"),
          arguments: {
            NAME: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "Scratch Cat"
            },
            TEXTURE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "dc7f14b8438834de154cebaf827b6b4d.svg"
            }
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
      if (drawable.BetterQuake?.shader === SHADER) {
        delete drawable.BetterQuake;
      }
    }
  }

  reloadShader({ SHADER }) {
    let drawableShader = this.QuakeManager.loadedShaders[SHADER]

    const shaderUsers = []
    for (let i = 0; i < this.runtime.renderer._allDrawables.length; i++) {
      const drawable = this.runtime.renderer._allDrawables[i];
      if (drawable.BetterQuake?.shader === SHADER) {
        shaderUsers.push(drawable)
      }
    }

    if (drawableShader) {
      this.removeShader({ SHADER })
    } else {
      drawableShader = {}
    }

    const asset = this.runtime.getGandiAssetContent(SHADER);
    if (asset) {
      drawableShader.source = asset.decodeText();
    }

    const programInfo = twgl.createProgramInfo(this.gl, [vertexShaderSource, SHADER === "__example__" ? fragmentShaderSource : drawableShader.source])
    this.gl.useProgram(programInfo.program)
    twgl.setBuffersAndAttributes(this.gl, programInfo.program, this.runtime.renderer._bufferInfo);
    drawableShader.programInfo = programInfo

    this.QuakeManager.loadedShaders[SHADER] = drawableShader

    shaderUsers.forEach(drawable => {
      drawable.BetterQuake = {}
      drawable.BetterQuake.shader = SHADER
      drawable.BetterQuake.uniforms = {
        u_color: [Math.random(), Math.random(), Math.random(), 1],
      }
    });

    this.runtime.renderer.dirty = true
  }

  allLoadedShaders() {
    return JSON.stringify(Object.keys(this.QuakeManager.loadedShaders))
  }

  applyShader({ SHADER, TARGET }, util) {
    const target = this._getTargetByIdOrName(TARGET, util)
    const drawable = this.runtime.renderer._allDrawables[target.drawableID]

    let drawableShader = this.QuakeManager.loadedShaders[SHADER]

    if (!drawableShader) {
      this.reloadShader({ SHADER })
      drawableShader = this.QuakeManager.loadedShaders[SHADER]
    }

    if (!drawable.BetterQuake) {
      drawable.BetterQuake = {}
    }

    drawable.BetterQuake.shader = SHADER
    drawable.BetterQuake.uniforms = {
      u_color: [Math.random(), Math.random(), Math.random(), 1],
    }

    this.runtime.renderer.dirty = true
  }

  detachShader({ SHADER, TARGET }, util) {
    const target = this._getTargetByIdOrName(TARGET, util)
    const drawable = this.runtime.renderer._allDrawables[target.drawableID]
    if (drawable.BetterQuake?.shader === SHADER) {
      delete drawable.BetterQuake
    }
  }

  setNumber({ UNIFORM, TARGET, VALUE}, util) {
    const target = this._getTargetByIdOrName(TARGET, util)
    const drawable = this.runtime.renderer._allDrawables[target.drawableID]
    if(!drawable.BetterQuake) return;

    drawable.BetterQuake.uniforms[UNIFORM] = VALUE
  }

  setVec2({ UNIFORM, TARGET, VALUE1, VALUE2}, util) {
    const target = this._getTargetByIdOrName(TARGET, util)
    const drawable = this.runtime.renderer._allDrawables[target.drawableID]
    if(!drawable.BetterQuake) return;

    drawable.BetterQuake.uniforms[UNIFORM] = [VALUE1, VALUE2]
  }

  setVec3({ UNIFORM, TARGET, VALUE1, VALUE2, VALUE3}, util) {
    const target = this._getTargetByIdOrName(TARGET, util)
    const drawable = this.runtime.renderer._allDrawables[target.drawableID]
    if(!drawable.BetterQuake) return;

    drawable.BetterQuake.uniforms[UNIFORM] = [VALUE1, VALUE2, VALUE3]
  }
  
  setVec4({ UNIFORM, TARGET, VALUE1, VALUE2, VALUE3, VALUE4}, util) {
    const target = this._getTargetByIdOrName(TARGET, util)
    const drawable = this.runtime.renderer._allDrawables[target.drawableID]
    if(!drawable.BetterQuake) return;

    drawable.BetterQuake.uniforms[UNIFORM] = [VALUE1, VALUE2, VALUE3, VALUE4]
  }

  setMatrix({ UNIFORM, TARGET, MATRIX}, util) {
    const target = this._getTargetByIdOrName(TARGET, util)
    const drawable = this.runtime.renderer._allDrawables[target.drawableID]
    if(!drawable.BetterQuake) return;

    //copy pasted from pen+. cmon, i cant bother to write it myself when ctrl+c ctrl+v do the job uwu
    let converted = JSON.parse(MATRIX);

    if (!Array.isArray(converted)) return;
    converted = converted.map(function (str) {
      return parseInt(str);
    });

    drawable.BetterQuake.uniforms[UNIFORM] = converted
  }

  setTexture({ UNIFORM, TARGET, TEXTURE}, util) {
    const target = this._getTargetByIdOrName(TARGET, util)
    const drawable = this.runtime.renderer._allDrawables[target.drawableID]
    if(!drawable.BetterQuake) return;

    drawable.BetterQuake.uniforms[UNIFORM] = this.QuakeManager.textures[Scratch.Cast.toString(TEXTURE)]
  }

  allTextures() {
    return JSON.stringify(Object.keys(this.QuakeManager.textures))
  }

  deleteTexture({ NAME }) {
    if (this.QuakeManager.textures[NAME]) {
      this.gl.deleteTexture(this.QuakeManager.textures[NAME]);
      delete this.QuakeManager.textures[NAME]
    }
  }

  deleteAllTextures() {
    this.QuakeManager.textures.forEach(texture => {
      this.gl.deleteTexture(texture);
    });
    this.QuakeManager.textures = []
  }

  createUpdateTexture({ NAME, TEXTURE}, util) {
    const textureName = Scratch.Cast.toString(NAME)
    this.deleteTexture(textureName)
    if (/(.*?)\.(png|svg|jpg|jpeg)/.test(String(TEXTURE))) {
      const id = String(TEXTURE).split(".")[0]
      const ext = String(TEXTURE).split(".")[1]
      const assetType = ext === 'svg' ? this.runtime.storage.AssetType.ImageVector : this.runtime.storage.AssetType.ImageBitmap
      const asset = this.runtime.storage.load(assetType, id, ext).then(asset => {
        const texture = twgl.createTexture(this.gl, {src: asset.encodeDataURI()})
        this.QuakeManager.textures[textureName] = texture
      });
    } else {
      const texture = twgl.createTexture(this.gl, {src: TEXTURE})
      this.QuakeManager.textures[textureName] = texture
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
}

window.tempExt = {
  Extension: BetterQuake,
  info: {
    name: "BetterQuake.extensionName",
    description: "BetterQuake.description",
    extensionId: "BetterQuake",
    //iconURL: banner.png,
    insetIconURL: icon,
    featured: true,
    disabled: false,
    collaboratorList: [
      {
        collaborator: 'Fath11@QuakeStudio',
        collaboratorURL: 'https://cocrea.world/@Fath11',
      },
      {
        collaborator: "酷可mc @ CCW",
        collaboratorURL: "https://www.ccw.site/student/203910367",
      },
    ],
  },
  l10n: {
    "zh-cn": {
      "BetterQuake.extensionName": "Better Quake",
      "BetterQuake.description": "Better shader loader",
    },
    en: {
      "BetterQuake.extensionName": "Better Quake",
      "BetterQuake.description": "Better shader loader",
    },
  },
}
