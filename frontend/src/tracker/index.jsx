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

const Tracker = () => {

  return (
    <div className="tracker">
      
    </div>
  )
}

const domContainer = document.querySelector('#container2');
ReactDOM.render(<Tracker/>, domContainer);