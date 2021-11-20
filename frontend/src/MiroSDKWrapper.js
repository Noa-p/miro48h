import Event from './event'

export default {
  createFrame (props) {
    return miro.board.createFrame(props)
      .then(frame => {
        Event.$emit(Event.type.createFrame, frame)
        return frame
      })
  },
  createShapeContainer (props) {
    return miro.board.createShape(props)
      .then(shape => {
        Event.$emit(Event.type.ContainerUpdated, shape)
        return shape
      })
  },
  createTextContainer (props) {
    return miro.board.createText(props)
      .then(text => {
        Event.$emit(Event.type.ContainerUpdated, text)
        return text
      })
  }
}
