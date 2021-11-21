import MiroSDKWrapper from "../MiroSDKWrapper"
import API from '../api'
import './style.css'

const tags = [
    {name: 'assign', bgColor: '#000'},
    {name: 'todo', title: 'To Do', bgColor: '#BDBDBD'},
    {name: 'inprocess',bgColor: '#FAC710'},
    {name: 'done',bgColor: '#2D9BF0'},
    {name: 'undermodified',bgColor: '#F24726'},
]

const App = () => {

  const handleTrackerVisible = async () => {
    await miro.board.ui.closePanel()
    await miro.board.ui.openPanel({
      pageUrl: 'tracker.html',
      maxHeight: 800,
    })
  }

  return (
    <div className="app">
      <div className='header'></div>
      <div className='tags'>
        {
          tags.map(i => {
            return <div key={i.name} className='tag' style={{backgroundColor:i.bgColor}}>
              <p>{i.name}</p>
            </div>
          })
        }
      </div>
      <div className='diver'></div>
      <div 
        className='tracker' 
        style={{backgroundColor:'#fff'}}
        onClick={handleTrackerVisible}
      ><p>Process Tracker</p></div>
    </div>
  )
}

const domContainer = document.querySelector('#container');
ReactDOM.render(<App/>, domContainer);