import * as React from 'react'
import styles from './styles.css'

class Pane extends React.Component {
  state = {
    state: 'IDLE',
    dragStart: { x: null, y: null },
    dragCorner: null
  };

  constructor(props) {
    super(props)

    this.corner_LB = React.createRef()
    this.corner_RT = React.createRef()

    /* ⚠️ bad */
    window.addEventListener('mousemove', e => {
      if (this.state.state === 'DRAGGING_CORNER') {
        const deltaX = e.clientX - this.state.dragStart.x
        const deltaY = e.clientY - this.state.dragStart.y

        console.log(`🔥  deltaX, deltaY`, deltaX, deltaY)

        if (this.state.dragCorner === 'RT') {
          /* ⚠️ should be doing greater delta */
          if (deltaX < -20) {
            this.setState({
              state: 'RESIZING_PANE'
            })
            this.props.createPane(this.props.id, 'right')
          } else if (deltaY > 20) {
            this.setState({
              state: 'RESIZING_PANE'
            })
            this.props.createPane(this.props.id, 'above')
          }
        }
      }
    })

    window.addEventListener('mouseup', e => {
      this.setState({
        dragCorner: null,
        state: 'IDLE',
        dragStart: { x: null, y: null }
      })
    })
  }

  handleMouseDown = corner => e => {
    /* 💁 prevent drag and drop default dragging */
    e.preventDefault();
    this.setState({
      state: 'DRAGGING_CORNER',
      dragCorner: corner,
      dragStart: { x: e.clientX, y: e.clientY }
    })
  };

  handleMouseMove = e => {};

  render() {
    let { left, top, width, height } = this.props.rect || {
      left: 0,
      right: 0,
      width: 0,
      height: 0
    };
    [left, top, width, height].forEach(measurement => {
      measurement = `${measurement}px`
    })

    return (
      <div className={styles.pane} style={{ left, top, width, height }}>
        <div
          onMouseDown={this.handleMouseDown('RT')}
          ref={this.corner_RT}
          className={styles.corner + ' ' + styles.rt}
        />
        {this.props.children || this.props.defaultComponent}
        <div
          onMouseDown={this.handleMouseDown('LB')}
          ref={this.corner_LB}
          className={styles.corner + ' ' + styles.lb}
        />
      </div>
    )
  }
}

export default Pane
