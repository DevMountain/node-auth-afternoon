import React, { Component } from 'react'
import './Header.css'

export default class Header extends Component {
    constructor() {
        super()
        this.state = {
            username: '',
            password: '',
            isAdmin: false,
        }
    }
    handleUsernameInput(){
        // should update this.state.username  based on user input. Do not mutate state, use setState.
    }
    handlePasswordInput(){
        // should update this.state.password based on user input. Do not mutate state, use setState.
    }

    toggleAdmin () {
        // should toggle the value of isAdmin on state, by setting it to the value of it's opposite. (!this.state.isAdmin)
    }

    login () {
        // create POST request to login endpoint
    }

    register () {
        // create POST request to register new user
    }

    logout () {
        // GET request to logout
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
                            <h4>{user.username}, welcome to the dragon's lair</h4>
                            <button type="submit" onClick={this.logout}>Logout</button>
                        </div>
                        )
                        :
                        <div className="loginContainer">

                            <input type="text"
                                placeholder="Username"
                                value={username}
                                
                            />
                            <input type="password"
                                placeholder="Password"
                                value={password}
                                
                            />
                            <div className='adminCheck' >
                                <input type="checkbox" id='adminCheckbox'  /> <span> Admin </span>
                            </div>
                            <button onClick={this.login}>Log In</button>
                            <button onClick={this.register} id='reg' >Register</button>

                        </div>}
            </div>
        )
    }
}
