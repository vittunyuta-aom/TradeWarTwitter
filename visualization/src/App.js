import React, { Component } from 'react'
import socketIOClient from 'socket.io-client'
import moment from 'moment'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,} from 'recharts';

const bppink = '#f5a7b9'
const starttime = moment().add(5, 'hours').format('MMMM Do YYYY, h:mm:ss')

class App extends Component {
  constructor() {
    super()
    this.state = {
      message: [],
      // endpoint: "http://localhost:4000" // เชื่อมต่อไปยัง url ของ realtime server
      endpoint: "35.225.174.2"
    }
  }

  componentDidMount = () => {
    const { endpoint, message } = this.state
    const temp = message
    const socket = socketIOClient(endpoint)
    socket.on('new-message', (messageNew) => {
      temp.push(messageNew)
      this.setState({ message: temp })
    })
  }

  render() {
    const { message } = this.state
    const data = [{ name: '00:00', count: 0 }, { name: '01:00', count: 0 }, { name: '02:00', count: 0 }, { name: '03:00', count: 0 },
    { name: '04:00', count: 0 }, { name: '05:00', count: 0 }, { name: '06:00', count: 0 }, { name: '07:00', count: 0 },
    { name: '08:00', count: 0 }, { name: '09:00', count: 0 }, { name: '10:00', count: 0 }, { name: '11:00', count: 0 },
    { name: '12:00', count: 0 }, { name: '13:00', count: 0 }, { name: '14:00', count: 0 }, { name: '15:00', count: 0 },
    { name: '16:00', count: 0 }, { name: '17:00', count: 0 }, { name: '18:00', count: 0 }, { name: '19:00', count: 0 },
    { name: '20:00', count: 0 }, { name: '21:00', count: 0 }, { name: '22:00', count: 0 }, { name: '23:00', count: 0 },
    ]
    message.forEach(m => {
      const mtime = moment(m.created_at).add(5, 'hours').format('hh')
      for (let i = 0; i < data.length; i++) {
        if (data[i].name.substring(0,2) === mtime) {
          data[i].count++
          break
        }
      }
    })

    // const data = [{ name: 'Page A', uv: 400, pv: 2400, amt: 2400 },
    // { name: 'Page B', uv: 200, pv: 2400, amt: 2400 }];
    return (
      <div>
        <div style={{ weight: '100%', height: '40px', backgroundColor: bppink }}>
          <h2 style={{ color: 'black', 'font-family': 'Fira Sans', paddingTop: 6, paddingLeft: 20 }}>Start Time: {starttime} +0000
          </h2>
        </div>
        <div style={{ paddingTop: '20px' }}>
          <LineChart
            width={1000}
            height={400}
            data={data}
            margin={{
              top: 5, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </div>
        <div style={{ weight: '100%', height: '50px', backgroundColor: bppink }}>
          <h1 style={{ color: 'black', 'font-family': 'Fira Sans', paddingTop: 5, paddingLeft: 20 }}>Tweets contain '#tradewar'</h1>
        </div>
        <div style={{ height: '700px', overflow: 'scroll' }}>
          {
            message.map((data, i) =>
              <div key={i} style={{ marginTop: 20, paddingLeft: 30, paddingRight: 30 }} >
                {i + 1} : {data.created_at} : {data.text}
              </div>
            )
          }
        </div>
      </div>
    )
  }
}

export default App