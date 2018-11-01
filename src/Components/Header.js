import React, { Component } from 'react'
import './Header.css'
import axios from 'axios'

export default class Header extends Component {
    constructor() {
        super()
        this.state = {
            username: '',
            password: '',
            isAdmin: false,
        }
    }
    handleInput = (value, name) => {
        this.setState({
            [name]: value
        })
    }

    toggleAdmin = () => {
        this.setState({ isAdmin: !this.state.isAdmin })
    }

    login = () => {
        const { username, password } = this.state
        axios.post('/auth/login', { username, password })
            .then(res => {
                this.setState({
                    username: '',
                    password: ''
                })
                this.props.updateUser(res.data.username, res.data.isAdmin)
            })
            .catch(err => {
                this.setState({ username: '', password: '' })
                alert(err.response.request.response)
            })
    }

    register = () => {
        const { username, password, isAdmin } = this.state
        axios.post('/auth/register', { username, password, isAdmin })
            .then(res => {
                this.setState({
                    username: '',
                    password: ''
                })
                this.props.updateUser(res.data.username, res.data.isAdmin)
            })
            .catch(err => {
                this.setState({ username: '', password: '' })
                alert(err.response.request.response)
            })
    }

    logout = () => {
        axios.get('/auth/logout')
    }

    render() {
        const { username, password } = this.state
        const { user } = this.props
        return (
            <div className='Header'>
                <div className="title">Dragon's Lair</div>
                {
                    user.username ?
                        (<div className='welcomeMessage'>
                            <h2>Welcome to the dragon's lair, {user.username}</h2>
                            <button type="submit" onClick={this.logout}>Logout</button>
                        </div>
                        )
                        :
                        <div className="loginContainer">

                            <input type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => this.handleInput(e.target.value, 'username')}
                            />
                            <input type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => this.handleInput(e.target.value, 'password')}
                            />
                            <div className='adminCheck' >
                                <input type="checkbox" id='adminCheckbox' onChange={this.toggleAdmin} /> <span> Admin </span>
                            </div>
                            <button onClick={this.login}>Log In</button>
                            <button onClick={this.register} id='reg' >Register</button>

                        </div>}
            </div>
        )
    }
}
