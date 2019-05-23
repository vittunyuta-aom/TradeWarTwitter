import React, { Component } from 'react'
import socketIOClient from 'socket.io-client'
import moment from 'moment'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, } from 'recharts';

const bppink = '#f5a7b9'
const starttime = moment().format('DD MMMM YYYY, HH:mm')

class App extends Component {
  constructor() {
    super()
    this.state = {
      message: [],
      // endpoint: "http://localhost:4000" // connect to backend
      endpoint: "35.225.174.2"
    }
  }

  componentDidMount = () => {
    const { endpoint, message } = this.state
    const socket = socketIOClient(endpoint)
    socket.on('messages', messages => {
      this.setState({ message: messages })
    })
  }

  render() {
    const { message } = this.state
    const data = []
    message.forEach(m => {
      const mtime = moment(m.created_at).format('DD/MM/YY HH:mm')
      let found = false

      if (data.length == 0)
        data.push({ name: mtime, countOfEachMin: 1 })

      for (let i = 0; i < data.length; i++) {
        if (data[i].name === mtime) {
          data[i].countOfEachMin++
          found = true
          break
        }
      }
      if (!found) {
        data.push({ name: mtime, countOfEachMin: 1 })
      }
    })

    return (
      <div>
        <div style={{ weight: '100%', height: '40px', backgroundColor: bppink }}>
          <h2 style={{ color: 'black', 'font-family': 'Fira Sans', paddingTop: 6, paddingLeft: 20 }}>Start Time: {starttime} +07:00
          </h2>
        </div>
        <div style={{ paddingTop: '20px' }}>
          <LineChart
            width={1200}
            height={400}
            data={data}
            margin={{
              top: 5, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name"/>
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="countOfEachMin" stroke={bppink} activeDot={{ r: 8 }} />
          </LineChart>
        </div>
        <div style={{ weight: '100%', height: '50px', backgroundColor: bppink }}>
          <h1 style={{ color: 'black', 'font-family': 'Fira Sans', paddingTop: 5, paddingLeft: 20 }}>Tweets contain '#tradewar'</h1>
        </div>
        <div style={{ height: '640px', overflow: 'scroll' }}>
          {
            message.map((data, i) =>
              <div key={i} style={{ marginTop: 20, paddingLeft: 30, paddingRight: 30 }} >
                {i + 1} : {moment(data.created_at).format()} : {data.text}
              </div>
            )
          }
        </div>
        <div style={{ weight: '100%', height: '30px', backgroundColor: bppink }}>
          <center><h4 style={{ color: 'black', 'font-family': 'Fira Sans', paddingTop: 6, paddingLeft: 20 }}>Vittunyuta Maeprasart 5910545019
          </h4></center>
          </div>
      </div>
    )
  }
}

export default App