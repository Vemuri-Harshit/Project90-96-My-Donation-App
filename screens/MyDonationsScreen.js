import React ,{Component} from 'react';
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native';
import{Card,Header,Icon} from 'react-native-elements';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'
import db from '../config.js';


export default class MyDonationsScreen extends Component{
    constructor(){
        super()
        this.state ={
            donorId: firebase.auth().currentUser.email,
            allDonations : []
        }
    }

    getAllDonations =()=>{
         db.collection("donated_items").where("donor_id" ,'==', this.state.donorId)
        .onSnapshot((snapshot)=>{
          var allDonations = []
          snapshot.docs.map((doc) =>{
            var donation = doc.data()
            donation["doc_id"] = doc.id
            allDonations.push(donation)
          });
          this.setState({
            allDonations : allDonations
          });
        })
      }

    componentDidMount(){
        this.getAllDonations()
    }
    

    keyExtractor = (item,index) => index.toString()
    
    renderItem=({item,i})=>{
     return(<ListItem 
        key={i} 
        title={item.item_name} 
        subtitle={"Requested By" + item.requested_by + "\nStatus:" + item.request_status}
        leftElement = {<Icon name = "book" type = "font-awesome" color = "green"/>} 
        titleStyle={{color:'black', fontWeight:'bold'}} 
        rightElement = {
            <TouchableOpacity>
                <Text>Send Book</Text>
            </TouchableOpacity>
        }
        bottomDivider /> )                                                      
    }

    render(){
        return(
          <View style={{flex:1}}>
            <MyHeader  title="My Donations"/>
            <View style={{flex:1}}>
              {
                this.state.allDonations.length === 0
                ?(
                  <View style={styles.subtitle}>
                    <Text style={{ fontSize: 20}}>List of all my Donations</Text>
                  </View>
                )
                :(
                  <FlatList
                    keyExtractor={this.keyExtractor}
                    data={this.state.allDonations}
                    renderItem={this.renderItem}
                  />
                )
              }
            </View>
          </View>
        )
      }
      }
   
   
      const styles = StyleSheet.create({
        button:{
          width:100,
          height:30,
          justifyContent:'center',
          alignItems:'center',
          shadowColor: "#000",
          shadowOffset: {
             width: 0,
             height: 8
           },
          elevation : 16
        },
        subtitle :{
          flex:1,
          fontSize: 20,
          justifyContent:'center',
          alignItems:'center'
        }
      })
      