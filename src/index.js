import * as twgl from 'twgl.js'
import vertexShaderSource from './vertexShaderSource.glsl'
import fragmentShaderSource from './fragmentShaderSource.glsl'
import BetterQuakeIcon from './assets/BetterQuakeIcon.svg'

;(Scratch => {
  const icon = `data:image/svg+xml;base64,${BetterQuakeIcon}`
  const extensionId = 'betterquake'

  class BetterQuake {
    constructor(runtime) {
      this.runtime = runtime
      if (!this.runtime.QuakeManager) this.runtime.QuakeManager = {}

      this.runtime.QuakeManager.loadedShaders = []
      this.runtime.QuakeManager.textures = []
      this.QuakeManager = this.runtime.QuakeManager

      this.gl = runtime.renderer._gl
      this.autoReRender = true

      //for compatibility with Spine skins
      //todo: replace with getSpineSkinClass()
      const skinClass = this.runtime.renderer.getSkinClass
        ? this.runtime.renderer.getSkinClass()
        : null

      const oldDrawThese = this.runtime.renderer._drawThese // TODO: If you do not use _drawThese then just remove it
      // However this is not recommended
      this.newDrawThese = (drawables, drawMode, projection, opts = {}) => {
        const renderer = this.runtime.renderer
        const gl = renderer._gl
        let currentShader = null
        if (renderer.spineManager) {
          renderer.spineManager.updateTime()
        }

        const framebufferSpaceScaleDiffers =
          'framebufferWidth' in opts &&
          'framebufferHeight' in opts &&
          opts.framebufferWidth !== renderer._nativeSize[0] &&
          opts.framebufferHeight !== renderer._nativeSize[1]

        const startIndex = Math.max(0, opts.startIndex ?? 0)
        const endIndex = Math.min(
          drawables.length,
          opts.endIndex ?? drawables.length
        )

        for (
          let drawableIndex = startIndex;
          drawableIndex < endIndex;
          ++drawableIndex
        ) {
          const drawableID = drawables[drawableIndex]

          // If we have a filter, check whether the ID fails
          if (opts.filter && !opts.filter(drawableID)) continue

          const drawable = renderer._allDrawables[drawableID]
          /** @todo check if drawable is inside the viewport before anything else */

          // Hidden drawables (e.g., by a "hide" block) are not drawn unless
          // the ignoreVisibility flag is used (e.g. for stamping or touchingColor).
          if (!drawable.getVisible() && !opts.ignoreVisibility) continue

          // drawableScale is the "framebuffer-pixel-space" scale of the drawable, as percentages of the drawable's
          // "native size" (so 100 = same as skin's "native size", 200 = twice "native size").
          // If the framebuffer dimensions are the same as the stage's "native" size, there's no need to calculate it.
          const drawableScale = framebufferSpaceScaleDiffers
            ? [
                (drawable.scale[0] * opts.framebufferWidth) /
                  renderer._nativeSize[0],
                (drawable.scale[1] * opts.framebufferHeight) /
                  renderer._nativeSize[1]
              ]
            : drawable.scale

          // If the skin or texture isn't ready yet, skip it.
          if (!drawable.skin || !drawable.skin.getTexture(drawableScale))
            continue

          // If the skin is not a Skin, we assume its an instance of SpineSkin
          // todo: replace with the actual SpineSkin class
          // tbh i dont know if this works. HCN if you are reading this, please merge https://github.com/Gandi-IDE/scratch-render/pull/1
          if (!skinClass || !(drawable.skin instanceof skinClass)) {
            renderer._doExitDrawRegion() // exit any draw region
            drawable.skin.render(drawable, drawableScale, projection, opts) // draw spine object
            // reset blend mode because spine renderer changes it
            // NOTE -  change blend is a costly operation, so we only do it when necessary
            gl.enable(gl.BLEND)
            continue
          }

          const uniforms = {}

          let effectBits = drawable.enabledEffects
          effectBits &= Object.prototype.hasOwnProperty.call(opts, 'effectMask')
            ? opts.effectMask
            : effectBits
          if (drawable.enabledExtraEffect !== 0) {
            effectBits |= drawable.enabledExtraEffect
            drawable.injectExtraEffectUniforms(uniforms)
          }

          // Our custom shader
          const drawableShader =
            runtime.QuakeManager.loadedShaders[drawable.BetterQuake?.shader]
          const newShader = drawableShader
            ? drawableShader.programInfo
            : renderer._shaderManager.getShader(drawMode, effectBits)

          // Manually perform region check. Do not create functions inside a
          // loop.
          if (renderer._regionId !== newShader) {
            renderer._doExitDrawRegion()
            renderer._regionId = newShader

            currentShader = newShader
            gl.useProgram(currentShader.program)
            twgl.setBuffersAndAttributes(
              gl,
              currentShader,
              renderer._bufferInfo
            )
            Object.assign(uniforms, {
              u_projectionMatrix: projection
            })
          }
          // if drawable has its own project, use it
          if (drawable.customizedProjection && drawMode !== 'straightAlpha') {
            Object.assign(uniforms, {
              u_projectionMatrix: drawable.customizedProjection
            })
          } else {
            Object.assign(uniforms, {
              u_projectionMatrix: projection
            })
          }

          Object.assign(
            uniforms,
            drawable.skin.getUniforms(drawableScale),
            drawable.getUniforms()
          )

          // Apply extra uniforms after the Drawable's, to allow overwriting.
          if (opts.extraUniforms) {
            Object.assign(uniforms, opts.extraUniforms)
          }

          // Apply BetterQuake uniforms
          if (drawableShader) {
            drawable.BetterQuake.uniforms.time =
              this.runtime.ioDevices.clock.projectTimer()
            drawable.BetterQuake.uniforms.tDiffuse = uniforms.u_skin
            Object.assign(uniforms, drawable.BetterQuake.uniforms)
          }

          if (uniforms.u_skin || drawable.BetterQuake.uniforms.tDiffuse) {
            //should bothh uniforms be available to use?
            //the only reason i want to keep tDiffuse is for compatibility with GandiQuake
            twgl.setTextureParameters(
              gl,
              uniforms.u_skin
                ? uniforms.u_skin
                : drawable.BetterQuake.uniforms.tDiffuse,
              {
                minMag: drawable.skin.useNearest(drawableScale, drawable)
                  ? gl.NEAREST
                  : gl.LINEAR
              }
            )
          }

          twgl.setUniforms(currentShader, uniforms)
          twgl.drawBufferInfo(gl, renderer._bufferInfo, gl.TRIANGLES)
        }

        renderer._regionId = null
        renderer.dirty = this.autoReRender
      }
      this.runtime.renderer._drawThese = this.newDrawThese
    }
    getInfo() {
      return {
        id: extensionId,
        name: 'Better Quake',
        color1: '#6645F6',
        color2: '#5237c5',
        color3: '#6645F6',
        blockIconURI: icon,
        menuIconURI: icon,
        blocks: [
          '---',
          {
            opcode: 'setAutoReRender',
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate('[SHOULD] auto re-render'),
            arguments: {
              SHOULD: {
                type: Scratch.ArgumentType.STRING,
                menu: 'SHOULD_MENU'
              }
            }
          },
          '---',
          {
            opcode: 'allLoadedShaders',
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate('All loaded shaders'),
            arguments: {},
            disableMonitor: true
          },
          {
            opcode: 'removeShader',
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate('Remove [SHADER]'),
            arguments: {
              SHADER: {
                type: Scratch.ArgumentType.STRING,
                menu: 'SHADER_MENU'
              }
            }
          },
          {
            opcode: 'reloadShader',
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate('Reload [SHADER]'),
            arguments: {
              SHADER: {
                type: Scratch.ArgumentType.STRING,
                menu: 'SHADER_MENU'
              }
            }
          },
          '---',
          {
            opcode: 'applyShader',
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate('Apply [SHADER] to [TARGET]'),
            arguments: {
              SHADER: {
                type: Scratch.ArgumentType.STRING,
                menu: 'SHADER_MENU'
              },
              TARGET: {
                type: Scratch.ArgumentType.STRING,
                menu: 'DRAWABLES_MENU'
              }
            }
          },
          {
            opcode: 'detachShader',
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate('Detach [SHADER] from [TARGET]'),
            arguments: {
              SHADER: {
                type: Scratch.ArgumentType.STRING,
                menu: 'SHADER_MENU'
              },
              TARGET: {
                type: Scratch.ArgumentType.STRING,
                menu: 'DRAWABLES_MENU'
              }
            }
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: Scratch.translate('Uniforms')
          },
          {
            opcode: 'setNumber',
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate(
              'Set number [UNIFORM] of [TARGET] to [VALUE]'
            ),
            arguments: {
              UNIFORM: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Uniform'
              },
              TARGET: {
                type: Scratch.ArgumentType.STRING,
                menu: 'DRAWABLES_MENU'
              },
              VALUE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'setVec2',
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate(
              'Set vector 2 [UNIFORM] of [TARGET] to [VALUE1][VALUE2]'
            ),
            arguments: {
              UNIFORM: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Uniform'
              },
              TARGET: {
                type: Scratch.ArgumentType.STRING,
                menu: 'DRAWABLES_MENU'
              },
              VALUE1: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              VALUE2: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'setVec3',
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate(
              'Set vector 3 [UNIFORM] of [TARGET] to [VALUE1][VALUE2][VALUE3]'
            ),
            arguments: {
              UNIFORM: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Uniform'
              },
              TARGET: {
                type: Scratch.ArgumentType.STRING,
                menu: 'DRAWABLES_MENU'
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
              }
            }
          },
          {
            opcode: 'setVec4',
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate(
              'Set vector 4 [UNIFORM] of [TARGET] to [VALUE1][VALUE2][VALUE3][VALUE4]'
            ),
            arguments: {
              UNIFORM: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Uniform'
              },
              TARGET: {
                type: Scratch.ArgumentType.STRING,
                menu: 'DRAWABLES_MENU'
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
              }
            }
          },
          {
            opcode: 'setMatrix',
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate(
              'Set matrix [UNIFORM] of [TARGET] to [MATRIX]'
            ),
            arguments: {
              UNIFORM: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Uniform'
              },
              TARGET: {
                type: Scratch.ArgumentType.STRING,
                menu: 'DRAWABLES_MENU'
              },
              MATRIX: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '[[], []]'
              }
            }
          },
          {
            opcode: 'setTexture',
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate(
              'Set texture [UNIFORM] of [TARGET] to [TEXTURE]'
            ),
            arguments: {
              UNIFORM: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Uniform'
              },
              TARGET: {
                type: Scratch.ArgumentType.STRING,
                menu: 'DRAWABLES_MENU'
              },
              TEXTURE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Scratch Cat'
              }
            }
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: Scratch.translate('Textures')
          },
          {
            opcode: 'allTextures',
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate('All textures'),
            arguments: {},
            disableMonitor: true
          },
          {
            opcode: 'deleteAllTextures',
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate('Delete all textures'),
            arguments: {}
          },
          {
            opcode: 'deleteTexture',
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate('Delete texture called [NAME]'),
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Scratch Cat'
              }
            }
          },
          {
            opcode: 'createUpdateTexture',
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate(
              'Create/Update texture called [NAME] with [TEXTURE]'
            ),
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Scratch Cat'
              },
              TEXTURE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'dc7f14b8438834de154cebaf827b6b4d.svg'
              }
            }
          }
        ],
        menus: {
          DRAWABLES_MENU: {
            acceptReporters: true,
            items: '_getDrawablesMenu'
          },
          SHADER_MENU: {
            acceptReporters: true,
            items: '_shaderList'
          },
          SHOULD_MENU: {
            items: [
              {
                text: Scratch.translate('Enable'),
                value: 'true'
              },
              {
                text: Scratch.translate('Disable'),
                value: 'false'
              }
            ]
          }
        }
      }
    }

    setAutoReRender({ SHOULD }) {
      this.autoReRender = SHOULD == 'true' ? true : false
    }

    removeShader({ SHADER }) {
      const shaderInfo = this.QuakeManager.loadedShaders[SHADER]
      if (!shaderInfo) {
        console.error(`Shader ${SHADER} not found.`)
        return
      }

      const shaderProgram = shaderInfo.programInfo.program
      const gl = this.gl

      // Retrieve attached shaders
      const shaders = gl.getAttachedShaders(shaderProgram)
      shaders.forEach(shader => {
        gl.detachShader(shaderProgram, shader)
        gl.deleteShader(shader)
      })

      // Delete the program
      gl.deleteProgram(shaderProgram)

      // Remove the shader from the loaded shaders
      delete this.QuakeManager.loadedShaders[SHADER]

      // Clean up any references to the shader in drawables
      for (let i = 0; i < this.runtime.renderer._allDrawables.length; i++) {
        const drawable = this.runtime.renderer._allDrawables[i]
        if (drawable?.BetterQuake?.shader === SHADER) {
          delete drawable.BetterQuake
        }
      }
    }

    reloadShader({ SHADER }) {
      let drawableShader = this.QuakeManager.loadedShaders[SHADER]

      const shaderUsers = []
      for (let i = 0; i < this.runtime.renderer._allDrawables.length; i++) {
        const drawable = this.runtime.renderer._allDrawables[i]
        if (drawable?.BetterQuake?.shader === SHADER) {
          shaderUsers.push(drawable)
        }
      }

      if (drawableShader) {
        this.removeShader({ SHADER })
      } else {
        drawableShader = {}
      }

      const asset = this.runtime.getGandiAssetContent
        ? this.runtime.getGandiAssetContent(SHADER)
        : null
      if (asset) {
        drawableShader.source = asset.decodeText()
      }

      const programInfo = twgl.createProgramInfo(this.gl, [
        vertexShaderSource,
        SHADER === '__example__' ? fragmentShaderSource : drawableShader.source
      ])
      this.gl.useProgram(programInfo.program)
      twgl.setBuffersAndAttributes(
        this.gl,
        programInfo.program,
        this.runtime.renderer._bufferInfo
      )
      drawableShader.programInfo = programInfo

      this.QuakeManager.loadedShaders[SHADER] = drawableShader

      shaderUsers.forEach(drawable => {
        drawable.BetterQuake = {}
        drawable.BetterQuake.shader = SHADER
        drawable.BetterQuake.uniforms = {
          u_color: [Math.random(), Math.random(), Math.random(), 1]
        }
      })

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
        u_color: [Math.random(), Math.random(), Math.random(), 1]
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

    setNumber({ UNIFORM, TARGET, VALUE }, util) {
      const target = this._getTargetByIdOrName(TARGET, util)
      const drawable = this.runtime.renderer._allDrawables[target.drawableID]
      if (!drawable.BetterQuake) return

      drawable.BetterQuake.uniforms[UNIFORM] = VALUE
    }

    setVec2({ UNIFORM, TARGET, VALUE1, VALUE2 }, util) {
      const target = this._getTargetByIdOrName(TARGET, util)
      const drawable = this.runtime.renderer._allDrawables[target.drawableID]
      if (!drawable.BetterQuake) return

      drawable.BetterQuake.uniforms[UNIFORM] = [VALUE1, VALUE2]
    }

    setVec3({ UNIFORM, TARGET, VALUE1, VALUE2, VALUE3 }, util) {
      const target = this._getTargetByIdOrName(TARGET, util)
      const drawable = this.runtime.renderer._allDrawables[target.drawableID]
      if (!drawable.BetterQuake) return

      drawable.BetterQuake.uniforms[UNIFORM] = [VALUE1, VALUE2, VALUE3]
    }

    setVec4({ UNIFORM, TARGET, VALUE1, VALUE2, VALUE3, VALUE4 }, util) {
      const target = this._getTargetByIdOrName(TARGET, util)
      const drawable = this.runtime.renderer._allDrawables[target.drawableID]
      if (!drawable.BetterQuake) return

      drawable.BetterQuake.uniforms[UNIFORM] = [VALUE1, VALUE2, VALUE3, VALUE4]
    }

    setMatrix({ UNIFORM, TARGET, MATRIX }, util) {
      const target = this._getTargetByIdOrName(TARGET, util)
      const drawable = this.runtime.renderer._allDrawables[target.drawableID]
      if (!drawable.BetterQuake) return

      //copy pasted from pen+. cmon, i cant bother to write it myself when ctrl+c ctrl+v do the job uwu
      let converted = JSON.parse(MATRIX)

      if (!Array.isArray(converted)) return
      converted = converted.map(function (str) {
        return parseInt(str)
      })

      drawable.BetterQuake.uniforms[UNIFORM] = converted
    }

    setTexture({ UNIFORM, TARGET, TEXTURE }, util) {
      const target = this._getTargetByIdOrName(TARGET, util)
      const drawable = this.runtime.renderer._allDrawables[target.drawableID]
      if (!drawable.BetterQuake) return

      drawable.BetterQuake.uniforms[UNIFORM] =
        this.QuakeManager.textures[Scratch.Cast.toString(TEXTURE)]
    }

    allTextures() {
      return JSON.stringify(Object.keys(this.QuakeManager.textures))
    }

    deleteTexture({ NAME }) {
      if (this.QuakeManager.textures[NAME]) {
        this.gl.deleteTexture(this.QuakeManager.textures[NAME])
        delete this.QuakeManager.textures[NAME]
      }
    }

    deleteAllTextures() {
      this.QuakeManager.textures.forEach(texture => {
        this.gl.deleteTexture(texture)
      })
      this.QuakeManager.textures = []
    }

    createUpdateTexture({ NAME, TEXTURE }, util) {
      const textureName = Scratch.Cast.toString(NAME)
      this.deleteTexture(textureName)
      if (/(.*?)\.(png|svg|jpg|jpeg)/.test(String(TEXTURE))) {
        const id = String(TEXTURE).split('.')[0]
        const ext = String(TEXTURE).split('.')[1]
        const assetType =
          ext === 'svg'
            ? this.runtime.storage.AssetType.ImageVector
            : this.runtime.storage.AssetType.ImageBitmap
        const asset = this.runtime.storage
          .load(assetType, id, ext)
          .then(asset => {
            const texture = twgl.createTexture(this.gl, {
              src: asset.encodeDataURI()
            })
            this.QuakeManager.textures[textureName] = texture
          })
      } else {
        const texture = twgl.createTexture(this.gl, { src: TEXTURE })
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
        .filter(target => !target.isStage && target.isOriginal)
        .map(target => ({
          text: target.sprite.name,
          value: target.sprite.name
        }))
      // 空检查
      if (menu.length === 0) {
        menu.push({
          text: '-',
          value: 'empty'
        })
      }
      return menu
    }

    _getDrawablesMenu() {
      const menu = this._getSpriteMenu()
      if (!this.runtime._editingTarget) return menu

      const editingTargetName = this.runtime._editingTarget.sprite.name

      const index = menu.findIndex(item => item.value === editingTargetName)
      if (index !== -1) {
        menu.splice(index, 1)
      }

      menu.unshift(
        {
          text: Scratch.translate('me'),
          value: '__myself__'
        },
        {
          text: Scratch.translate('stage'),
          value: '__stage__'
        }
      )
      return menu
    }

    _shaderList() {
      const list = this.runtime.getGandiAssetsFileList
        ? this.runtime.getGandiAssetsFileList('glsl').map(item => item.fullName)
        : []
      list.push({
        text: Scratch.translate('example'),
        value: '__example__'
      })

      return list
    }
  }

  if (Scratch.vm?.runtime) {
    Scratch.extensions.register(new BetterQuake(Scratch.vm.runtime))
  } else {
    window.tempExt = {
      Extension: BetterQuake,
      info: {
        name: 'BetterQuake.extensionName',
        description: 'BetterQuake.description',
        extensionId: 'BetterQuake',
        //iconURL: banner.png,
        insetIconURL: icon,
        featured: true,
        disabled: false,
        collaboratorList: [
          {
            collaborator: 'Fath11@QuakeStudio',
            collaboratorURL: 'https://cocrea.world/@Fath11'
          },
          {
            collaborator: '酷可mc @ CCW',
            collaboratorURL: 'https://www.ccw.site/student/203910367'
          },
          {
            collaborator: '熊谷 凌',
            collaboratorURL: 'https://github.com/FurryR'
          }
        ]
      },
      l10n: {
        'zh-cn': {
          'BetterQuake.extensionName': 'Better Quake',
          'BetterQuake.description': 'Better shader loader'
        },
        en: {
          'BetterQuake.extensionName': 'Better Quake',
          'BetterQuake.description': 'Better shader loader'
        }
      }
    }
  }
})(Scratch)
