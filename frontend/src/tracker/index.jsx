import MiroSDKWrapper from "../MiroSDKWrapper"
import API from '../api'
import './style.css'
import _ from 'lodash'

const count = (ownerData) => {
  let ct = 0
  Object.keys(ownerData).map(i => {
    ct += ownerData[i].length
  })

  return ct
}

// const allData = {
//   hh: {
//     todo: [{Owner:'hh',State:'todo',frameid:'1'}],
//     inprocess: [{Owner:'hh',State:'todo',frameid:'2'},
//               {Owner:'hh',State:'todo',frameid:'8'},
//               {Owner:'hh',State:'todo',frameid:'9'},
//               {Owner:'hh',State:'todo',frameid:'10'},
//               {Owner:'hh',State:'todo',frameid:'11'}],

//   },
//   ak: {
//     todo: [{Owner:'ak',State:'todo',frameid:'3'}],
//     done: [{Owner:'ak',State:'done',frameid:'4'},{Owner:'ak',State:'done',frameid:'5'}],
//     undermodified: [{Owner:'ak',State:'undermodified',frameid:'6'},{Owner:'ak',State:'undermodified',frameid:'7'}],
//   },
//   akss: {
//     todo: [{Owner:'ak',State:'todo',frameid:'3'}],
//     done: [{Owner:'ak',State:'done',frameid:'4'},{Owner:'ak',State:'done',frameid:'5'}],
//     undermodified: [{Owner:'ak',State:'undermodified',frameid:'6'},{Owner:'ak',State:'undermodified',frameid:'7'}],
//   },
//   akss2: {
//     todo: [{Owner:'ak',State:'todo',frameid:'3'}],
//     done: [{Owner:'ak',State:'done',frameid:'4'},{Owner:'ak',State:'done',frameid:'5'}],
//     undermodified: [{Owner:'ak',State:'undermodified',frameid:'6'},{Owner:'ak',State:'undermodified',frameid:'7'}],
//   }
// }

class Tracker extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      allData: {}
    }
  }

  componentDidMount() {
    API
      .GetAllData()
      .then(res => {
          let data = {}
          Object.keys(res).map(frameid => {
              const frame = _.cloneDeep(res[frameid])
              frame.frameid = frameid
              const owner = res[frameid]["_Owner"]
              const state = res[frameid]["State"]
              console.log(res[frameid],owner, state)
              if (owner in data) {
                  if (state in data[owner]) {
                      data[owner][state].push(res[frameid])
                  }
                  else {
                      data[owner][state]=[]
                      data[owner][state].push(res[frameid])
                  }
              } else {
                  data[owner] = {}
                  data[owner][state]=[]
                  data[owner][state].push(res[frameid])
              }
          })
          this.setState({
            allData:data
          })
      })
  }
  
  render () {

    const { allData } = this.state;

    return (
      <div className="tracker">
        <div className="container">
          {
            Object.keys(allData).map(owner => {
              return (
                <div className='ownerWrapper'>
                <div className='ownerTitle'>{owner} | {count(allData[owner]) || 0}</div>
                <div className='diver'></div>
                <div key={owner} className='owner'>
                    {
                      Object.keys(allData[owner]).map(state => {
                        return <div key={state} className="state">
                          {allData[owner][state].map(frame => {
                            return <div key={owner+'_'+state+'_'+frame.frameid} className={`preview-${frame.State}`}></div>
                          })}
                        </div>
                      })
                    }
                </div>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
  
}

const domContainer = document.querySelector('#container2');
ReactDOM.render(<Tracker/>, domContainer);