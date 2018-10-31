import React, { Component } from 'react'
import './Container.css'
import axios from 'axios'
import Treasure from '../Treasure'

export default class Container extends Component {
    constructor() {
        super()
        this.state = {
            dragon: [],
            user: [],
            all: []
        }
    }

    getTreasure = (e) => {
        const { name } = e.target
        axios.get(`/api/treasure/${name}`)
            .then(res => this.setState({
                [name]: res.data
            }))
            .catch(err => alert(err.response.request.response))
    }

    render() {
        console.log(this.state)
        const { dragon, user, all } = this.state
        return (
            <div className='Container' >
                {dragon[0] ? <div className='treasureBox loggedIn'>
                    <h1>Dragon's treasure</h1>
                    <Treasure treasure={dragon} />
                </div> :
                    <div className='treasureBox' >
                        <button className='title' onClick={this.getTreasure} name='dragon' >See Dragon's <br /> Treasure</button>
                    </div>
                }
                {user[0] ? <div className='treasureBox loggedIn'>
                    <h1>My treasure</h1>
                    <Treasure treasure={user} />
                </div> :
                    <div className='treasureBox' >
                        <button className='title' onClick={this.getTreasure} name='user' >See My <br /> Treasure</button>
                    </div>}
                {all[0] ? <div className='treasureBox loggedIn'>
                    <h1>All treasure</h1>
                    <Treasure treasure={all} />
                </div> :
                    <div className='treasureBox' >
                        <button className='title' onClick={this.getTreasure} name='all' >See All <br /> Treasure</button>
                    </div>}
            </div>
        )
    }
}
