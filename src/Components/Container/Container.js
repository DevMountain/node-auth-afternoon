import React, { Component } from 'react'
import './Container.css'

export default class Container extends Component {
    render() {
        return (
            <div className='Container' >
                <div className='treasureBox' >
                    <button className='title'>See Dragon's <br/> Treasure</button>
                </div>
                <div className='treasureBox' >
                    <button className='title'>See My <br /> Treasure</button>
                </div>
                <div className='treasureBox' >
                    <button className='title'>See All <br /> Treasure</button>
                </div>
            </div>
        )
    }
}
