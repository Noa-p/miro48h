import MiroSDKWrapper from "../MiroSDKWrapper"
import API from '../api'
import './style.css'
import Action from '../action'
import Tags from '../tag.def'
import Event from '../event'

const tags = [
    //{name: 'assign', bgColor: '#000'},
    {name: 'todo', title: 'TO DO', bgColor: '#BDBDBD'},
    {name: 'inprocess',title: 'IN PROCESS',bgColor: '#FAC710'},
    {name: 'done',title: 'DONE',bgColor: '#2D9BF0'},
    {name: 'undermodified',title: 'MODIFYING',bgColor: '#F24726'},
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
        <input id="assign_name" name="assign_name" type="text"/>
        <div
          key='assign'
          className='tag'
          style={{backgroundColor:'#000'}}
          onClick={async () => {
            const name = document.getElementById('assign_name').value
            console.log(name)
            const frames = await API.GetSelectionFrames()
            for (const frame of frames) {
              Action.UpdateOwnerForAFrame(
                {
                  height: 30,
                  width: 130,
                  x: frame.x + frame.width/2 - 130 / 2 - 130,
                  y: frame.y - frame.height / 2 + 30 / 2,
                  style: {
                    fillColor: '#ccc'
                  }
                },
                frame, '', name 
              )
            }
          }
        }
        >
          <p>ASSIGN</p>
        </div>
        {
          tags.map(i => {
            return <div
              key={i.name}
              className='tag'
              style={{backgroundColor:i.bgColor}}
              onClick={async () => {
                const frames = await API.GetSelectionFrames()
                console.log(frames)
                for (const frame of frames) {
                  Action.UpdateStateForAFrame(
                    {
                      height: 30,
                      width: 130,
                      x: frame.x + frame.width/2 - 130 / 2,
                      y: frame.y - frame.height / 2 + 30 / 2,
                      style: {
                        fillColor: i.bgColor
                      }
                    },
                    frame, i.name
                  )
                }
              }
            }
            >
              <p>{i.title}</p>
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
