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

        // const { username, password } = this.state
        // axios.post('/auth/login', { username, password })
        //     .then(res => {
        //         const {username, isAdmin}=res.data
        //         this.setState({
        //             username: '',
        //             password: ''
        //         })
        //         this.props.updateUser({username, isAdmin})
        //     })
        //     .catch(err => {
        //         this.setState({ username: '', password: '' })
        //         alert(err.response.request.response)
        //     })
    }

    register () {
        // create POST request to register new user

    //     const { username, password, isAdmin } = this.state
    //     axios.post('/auth/register', { username, password, isAdmin })
    //         .then(res => {
    //             console.log(res.data)
    //             const { username, isAdmin } = res.data
    //             this.setState({
    //                 username: '',
    //                 password: ''
    //             })
    //             this.props.updateUser({username, isAdmin})
    //         })
    //         .catch(err => {
    //             this.setState({ username: '', password: '' })
    //             alert(err.response.request.response)
    //         })
    }

    logout () {
        // GET request to logout

        // axios.get('/auth/logout').then(() => {
        //     this.props.updateUser({})
        // })
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
                                onChange={()=>{}}
                            />
                            <input type="password"
                                placeholder="Password"
                                value={password}
                                onChange={()=>{}}
                            />
                            <div className='adminCheck' >
                                <input type="checkbox" id='adminCheckbox' onChange={()=>{}} /> <span> Admin </span>
                            </div>
                            <button onClick={this.login}>Log In</button>
                            <button onClick={this.register} id='reg' >Register</button>

                        </div>}
            </div>
        )
    }
}
