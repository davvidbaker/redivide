/* eslint-disable camelcase */
import * as React from 'react'
import Pane from './Pane'

import styles from './styles.css'

const RESIZING_PANES = 'RESIZING_PANES'
const IDLE = 'IDLE'
class Redivide extends React.Component {
  constructor(props) {
    super(props)

    this.container = React.createRef()

    this.state = {
      state: IDLE,
      panes: props.children ? { 0: { children: props.children } } : { 0: {} }
    }

    window.addEventListener('mousemove', e => {
      if (this.state.state === RESIZING_PANES) {
        const existingPane = this.state.panes[this.state.resizingPanes[0]]
        const newerPane = this.state.panes[this.state.resizingPanes[1]]

        console.log(
          `🔥  this.state.resizingPanes`,
          this.state.resizingPanes,
          this.state.panes
        )

        if (newerPane) {
          if (this.state.resizingDirection === 'right') {
            this.setState(state => ({
              panes: Object.assign(state.panes, {
                [state.resizingPanes[0]]: Object.assign(existingPane, {
                  rect: Object.assign(existingPane.rect, {
                    width: e.clientX - state.existingPaneRect.left
                  })
                }),
                [state.resizingPanes[1]]: Object.assign(newerPane, {
                  rect: Object.assign(newerPane.rect, {
                    left: e.clientX,
                    width:
                      state.existingPaneRect.width +
                      state.existingPaneRect.left -
                      e.clientX
                  })
                })
              })
            }))
          } else if (this.state.resizingDirection === 'above') {
            this.setState(state => ({
              panes: Object.assign(state.panes, {
                [state.resizingPanes[0]]: Object.assign(existingPane, {
                  rect: Object.assign(existingPane.rect, {
                    height: e.clientY - state.existingPaneRect.top
                  })
                }),
                [state.resizingPanes[1]]: Object.assign(newerPane, {
                  rect: Object.assign(newerPane.rect, {
                    top: e.clientY,
                    height:
                      state.existingPaneRect.height +
                      state.existingPaneRect.top -
                      e.clientY
                  })
                })
              })
            }))
          }
        }
      }
    })

    window.addEventListener('mouseup', e => {
      if (this.state.state === RESIZING_PANES) {
        this.setState({
          state: IDLE
        })
      }
    })
  }
  static propTypes = {
    // text: PropTypes.string
  };

  componentDidMount() {
    /* 💁 I don't want the #<DOMRect> */
    const {
      top,
      left,
      width,
      height
    } = this.container.current.getBoundingClientRect()
    const containerRect = Object.freeze({ top, left, width, height })

    this.setState(state => ({
      containerRect,
      panes: {
        ...state.panes,
        0: {
          children: this.props.children,
          rect: Object.assign({}, containerRect)
        }
      }
    }))
  }

  createPane = (id, direction) => {
    /* ⚠️ fix math.random */
    const new_id = String(Math.floor(10000 * Math.random()))

    const existingPaneRect = Object.assign({}, this.state.panes[id].rect)

    this.setState({
      state: RESIZING_PANES,
      panes: Object.assign(this.state.panes, {
        [new_id]: {
          rect: Object.assign({}, this.state.panes[id].rect)
        }
      }),
      existingPaneRect,
      resizingDirection: direction,
      resizingPanes: [id, new_id]
    })
  };

  render() {
    return (
      <div ref={this.container} className={styles.container}>
        {Object.entries(this.state.panes).map(([id, pane]) => (
          <Pane
            rect={pane.rect}
            id={id}
            key={id}
            defaultComponent={this.props.defaultComponent}
            createPane={this.createPane}
          >
            {pane.children}
          </Pane>
        ))}
      </div>
    )
  }
}

export default Redivide
