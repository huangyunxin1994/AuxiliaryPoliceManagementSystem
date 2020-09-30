import Modal from 'ant-design-vue/es/modal'
export default (Vue) => {
  function dialog (component, componentProps, modalProps) {
    const _vm = this
    modalProps = modalProps || {}
    if (!_vm || !_vm._isVue) {
      return
    }
    let dialogDiv = document.querySelector('body>div[type=dialog]')
    if (!dialogDiv) {
      dialogDiv = document.createElement('div')
      dialogDiv.setAttribute('type', 'dialog')
      document.body.appendChild(dialogDiv)
    }

    const handle = function (checkFunction, afterHandel) {
      if (checkFunction instanceof Function) {
        const res = checkFunction()
        if (res instanceof Promise) {
          res.then(c => {
            c && afterHandel()
          })
        } else {
          res && afterHandel()
        }
      } else {
        // checkFunction && afterHandel()
        checkFunction || afterHandel()
      }
    }

    const dialogInstance = new Vue({
      data () {
        return {
          visible: true
        }
      },
      router: _vm.$router,
      store: _vm.$store,
      mounted () {
        this.$on('close', () => {
          this.handleClose()
        })
      },
      methods: {
        handleClose () {
          handle(this.$refs._component.onCancel, () => {
            this.visible = false
            this.$refs._component.$emit('close',dialogInstance)
            this.$refs._component.$emit('cancel',dialogInstance)
            
          })
        },
        handleOk () {
          handle(this.$refs._component.onOK || this.$refs._component.onOk, () => {
            this.visible = false
            this.$refs._component.$emit('close',dialogInstance)
            this.$refs._component.$emit('ok',dialogInstance)
          })
        },
        handleDestroy(){
          handle(this.$refs._component.onOK || this.$refs._component.onOk || this.$refs._component.onCancel, () => {
            dialogInstance.$destroy()
            console.log('Modal Is Destroyed!')
          })
        }
      },
      render: function (h) {
        const that = this
        const modalModel = modalProps && modalProps.model
        if (modalModel) {
          delete modalProps.model
        }
        const ModalProps = Object.assign({}, modalModel && { model: modalModel } || {}, {
          attrs: Object.assign({}, {
            ...(modalProps.attrs || modalProps)
          }, {
            visible: this.visible
          }),
          on: Object.assign({}, {
            ...(modalProps.on || modalProps)
          }, {
            ok: () => {
              that.handleOk()
            },
            cancel: () => {
              that.handleClose()
            }
          })
        })
        console.log(ModalProps.attrs)
        const componentModel = componentProps && componentProps.model
        if (componentModel) {
          delete componentProps.model
        }
        const ComponentProps = Object.assign({}, componentModel && { model: componentModel } || {}, {
          ref: '_component',
          attrs: Object.assign({}, {
            ...((componentProps && componentProps.attrs) || componentProps)
          }),
          on: Object.assign({}, {
            ...((componentProps && componentProps.on) || componentProps)
          })
        })
        console.log(componentProps)
        console.log(ComponentProps.attrs)
        return h(Modal, ModalProps, [h(component, ComponentProps)])
      }
    }).$mount(dialogDiv)
  }

  Object.defineProperty(Vue.prototype, '$dialog', {
    get: () => {
      return function () {
        dialog.apply(this, arguments)
      }
    }
  })
}
