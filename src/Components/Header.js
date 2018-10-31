import React, { Component } from 'react'
import './Header.css'
import axios from 'axios'

export default class Header extends Component {
    constructor() {
        super()
        this.state = {
            username: '',
            password: '',
            admin: false,
            user: {}
        }
    }
    handleInput = (value, name) => {
        this.setState({
            [name]: value
        })
    }

    toggleAdmin = () => {
        this.setState({ admin: !this.state.admin })
    }

    login = () => {
        const { username, password } = this.state
        axios.post('/auth/login', { username, password })
            .then(res => {
                this.setState({
                    user: {
                        username: res.data.name, admin: res.data.admin
                    },
                    username: '',
                    password: ''
                })
            })
            .catch(err => {
                console.log(err.response) || alert(err.response.request.response)
            })
    }

    register = () => {
        const { username, password, admin } = this.state
        axios.post('/auth/register', { username, password, admin })
            .then(res => {
                this.setState({
                    user: {
                        username: res.data.name, admin: res.data.admin
                    },
                    username: '',
                    password: ''
                })
            })
            .catch(err => alert(err.response.request.response))
    }

    render() {
        const { username, password } = this.state
        return (
            <div className='Header'>
                <div className="title">Dragon's Lair</div>
                <div className="loginContainer">

                    <input type="text"
                        placeholder="Username"
                        value={this.username}
                        onChange={(e) => this.handleInput(e.target.value, 'usernameInput')}
                    />
                    <input type="password"
                        placeholder="Password"
                        value={this.password}
                        onChange={(e) => this.handleInput(e.target.value, 'passwordInput')}
                    />
                    <div className='adminCheck' >
                        <input type="checkbox" id='adminCheckbox' onChange={this.toggleAdmin} /> <span> Admin </span>
                    </div>
                    <button onClick={this.login}>Log In</button>
                    <button onClick={this.register} id='reg' >Register</button>

                </div>
            </div>
        )
    }
}
