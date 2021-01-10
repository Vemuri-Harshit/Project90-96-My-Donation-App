import React,{Component} from 'react'
import {Text,View,KeyboardAvoidingView,TextInput,TouchableOpacity,StyleSheet} from 'react-native'
import db from '../config'
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'
//using live share
export default class RequestScreen extends Component{
     constructor(){
         super()
         this.state={
            userId : firebase.auth().currentUser.email,
            item: '',
            reason: '',
            request_status:''
        }
     }

     createUniqueId=()=>{
         return Math.random().toString(36).substring(7);
     }

     createRequest=()=>{
        var userId = this.state.userId
        var uniqueId = this.createUniqueId()
        db.collection('requested_items').add({
            'user_id':userId,
            'item_name':this.state.item,
            'reason':this.state.reason,
            'request_status':'requested',
            'request_id':uniqueId
        })

        this.setState({
            item:'',
            reason: ''
        })
        return alert("Request Has been Made")
     }

    render(){
        return(
            <View style = {{flex:1}}>
               <MyHeader title = "Request Items" navigation ={this.props.navigation}/>
               <KeyboardAvoidingView style ={styles.keyBoardStyle}>

                    <View>
                        <TextInput style ={styles.formTextInput} placeholder = "Item" onChangeText = {(text)=>{this.setState({item: text})}} value = {this.state.item}/>
                        <TextInput style ={styles.formTextInput, {height:300}} placeholder = "Why Do You want this Item" multiline numberOfLines = {8} onChangeText = {(text)=>{this.setState({reason: text})}} value = {this.state.reason}/>
                    </View>

                    <View>
                        <TouchableOpacity style ={styles.button} onPress={()=>{this.createRequest()}}><Text>Request</Text></TouchableOpacity>
                    </View>

               </KeyboardAvoidingView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        backgroundColor : '#D3D3D3'
    },
    keyBoardStyle : {
    //  flex:1,
      alignItems:'center',
      justifyContent:'center'
    },
    formTextInput:{
      width:"75%",
      height:35,
      alignSelf:'center',
      borderColor:'#ffab91',
      borderRadius:10,
      borderWidth:1,
      marginTop:20,
      padding:10,
    },
    button:{
      width:"100%",
      height:50,
      justifyContent:'center',
      alignItems:'center',
      borderRadius:10,
      borderColor:'#ffab91',
      backgroundColor:"#ff5722",
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 8,
      },
      shadowOpacity: 0.44,
      shadowRadius: 10.32,
      elevation: 16,
      marginTop:20
      },
    }
  )