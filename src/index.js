import * as twgl from 'twgl.js';

const extensionId = "quakeFrag";

var vertexShaderSource = `#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec2 position;
out vec2 fragUV;

// Used to pass in the resolution of the canvas
uniform vec2 u_resolution;

// all shaders have a main function
void main() {
  gl_Position = vec4(position, 0, 1);
  fragUV = position;
}
    `;

var fragmentShaderSource = `#version 300 es

    // fragment shaders don't have a default precision so we need
    // to pick one. highp is a good default. It means "high precision"
    precision highp float;
    in vec2 fragUV;

    uniform vec4 u_color;
    uniform sampler2D u_skin;

    // we need to declare an output for the fragment shader
    out vec4 outColor;

    void main() {
      outColor = texture(u_skin, fragUV);
    }
    `;

/*
 * By: Xeltalliv
 * Link: https://github.com/Xeltalliv/extensions/blob/webgl2-dev/extensions/webgl2.js
 *
 * Modified by: Fath11
 * Link: https://github.com/fath11
 *
 * Please keep this comment if you wanna use this code :3
 */
class Skins {
  constructor(runtime) {
    this.runtime = runtime;
    const Renderer = runtime.renderer;
    const Skin = this.runtime.renderer.exports.Skin;

    class SimpleSkin extends Skin {
      constructor(id, renderer) {
        super(id, renderer);
        this.renderer = Renderer;
        const gl = renderer.gl;
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0,255,0,255]));
        this._texture = texture;
        this._rotationCenter = [320, 180];
        this._size = [640, 360];
      }
      dispose() {
        if (this._texture) {
          this.renderer.gl.deleteTexture(this._texture);
          this._texture = null;
        }
        super.dispose();
      }
      set size(value) {
        this._size = value;
        this._rotationCenter = [value[0] / 2, value[1] / 2];
      }
      get size() {
        return this._size;
      }
      getTexture(scale) {
        return this._texture || super.getTexture();
      }
      setContent(textureData) {
        const gl = this.renderer.gl;
        gl.bindTexture(gl.TEXTURE_2D, this._texture);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          textureData,
        );
        this.emit(Skin.Events.WasAltered);
      }
    }

    this.SimpleSkin = SimpleSkin;
  }
}
//End of Skins, Please keep this comment if you wanna use this code :3

class QuakeFragment {
  constructor(runtime) {
    window.TEST = this;
    TEST.runtime = runtime;

    this.runtime = runtime;

    this.initFormatMessage({
      extensionName: ["地震碎片", "Quake Fragmment"],
      me: ["我", "me"],
    });
  }
  initFormatMessage(l10n) {
    const res = { "zh-cn": {}, en: {} };
    Object.entries(l10n).forEach(([id, msgs]) => {
      const ID = `${extensionId}.${id}`;
      [res["zh-cn"][ID], res.en[ID]] = msgs;
    });
    const _formatMessage = this.runtime.getFormatMessage(res);
    this.fm = (id) => {
      const ID = `${extensionId}.${id}`;
      return _formatMessage({
        ID,
        default: ID,
        description: ID,
      });
    };
  }
  getInfo() {
    return {
      id: "quakefrag",
      name: "Quake Fragment",
      blocks: [
        {
          opcode: "applyShader",
          blockType: Scratch.BlockType.COMMAND,
          text: "Apply shader to [SPRITE]",
          arguments: {
            SPRITE: {
              type: Scratch.ArgumentType.STRING,
              menu: "SPRITE_MENU_WITH_MYSELF",
            },
          },
        },
      ],
      menus: {
        SPRITE_MENU_WITH_MYSELF: {
          acceptReporters: true,
          items: "__spriteMenuWithMyself",
        },
      },
    };
  }

  applyShader({ SPRITE }, util) {
    console.log(util)
    const target = this.__getTargetByIdOrName(SPRITE, util)

    const currentCostume = target.getCurrentCostume()

    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    if (!gl) {
      console.error("HelloWorld: WebGL not supported");
    }

    const programInfo = twgl.createProgramInfo(gl, [vertexShaderSource, fragmentShaderSource]);

    const positionBufferInfo = twgl.createBufferInfoFromArrays(gl, {
      position: {
          numComponents: 2,
          data: [
            -1, -1,
            1, -1,
            -1, 1,
            -1, 1,
            1, -1,
            1, 1,
          ]
      },
    });  

    this.skinId = this.runtime.renderer._nextSkinId++;
    let SkinsClass = new Skins(this.runtime);
    this.runtime.renderer._allSkins[this.skinId] = new SkinsClass.SimpleSkin(
      this.skinId,
      this.runtime.renderer,
    );
    this.runtime.renderer.updateDrawableSkinId(target.drawableID, this.skinId);

    const img = this.runtime.renderer._allSkins[currentCostume.skinId]._canvas

    this.runtime.renderer._allSkins[this.skinId].size = this.runtime.renderer._allSkins[currentCostume.skinId].size;
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
    const texture = twgl.createTexture(gl, {
        mag: gl.NEAREST,
        min: gl.LINEAR,
        src: img,
        //wrap: gl.CLAMP_TO_EDGE
      }
    );

    const uniforms = {
      u_resolution: [canvas.width, canvas.height],
      u_color: [Math.random(), Math.random(), Math.random(), 1],
      u_skin: texture
    };
  
    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, positionBufferInfo);

    twgl.setUniforms(programInfo, uniforms);
    twgl.drawBufferInfo(gl, positionBufferInfo);

    this.runtime.renderer._allSkins[this.skinId].setContent(canvas);
    this.runtime.requestRedraw();
  }

  __getTargetByIdOrName(name, util) {
    if (name === '__myself__') return util.target;
    let target = this.runtime.getSpriteTargetByName(name);
    if (!target) {
      target = this.runtime.getTargetById(name);
      if (!target) return null;
    }
    return target;
  }

  __getSpriteMenu() {
    const { targets } = this.runtime;
    // 跳过舞台
    const menu = targets
      .filter((target) => !target.isStage && target.isOriginal)
      .map((target) => ({
        text: target.sprite.name,
        value: target.sprite.name,
      }));
    // 空检查
    if (menu.length === 0) {
      menu.push({
        text: "-",
        value: "empty",
      });
    }
    return menu;
  }

  __spriteMenuWithMyself() {
    const menu = this.__getSpriteMenu();
    if (!this.runtime._editingTarget) return menu;
    // 当前角色名称
    const editingTargetName = this.runtime._editingTarget.sprite.name;
    // 从列表删除自己
    const index = menu.findIndex((item) => item.value === editingTargetName);
    if (index !== -1) {
      menu.splice(index, 1);
    }
    // 列表第一项插入“自己”
    if (this.runtime._editingTarget.isStage) return menu;
    menu.unshift({
      text: this.fm("me"),
      value: "__myself__",
    });
    return menu;
  }
}

window.tempExt = {
  Extension: QuakeFragment,
  info: {
    name: "quakefragment.extensionName",
    description: "quakefragment.description",
    extensionId: "quakefragment",
    // iconURL: icon,
    // insetIconURL: cover,
    featured: true,
    disabled: false,
    collaborator: "only for quakefragment test",
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
};
