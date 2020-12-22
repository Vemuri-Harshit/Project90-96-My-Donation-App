import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity,Image } from 'react-native';
import { ListItem } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../components/MyHeader';

export default class DonateScreen extends Component{
     constructor(){
        super()
         this.state={
            allRequests : []      
         }
         this.requestRef = null
     }

     getAllRequests=()=>{
         this.requestRef = db.collection('requested_items')
         .onSnapshot((snapshot)=>{
             var allRequests =snapshot.docs.map(document => document.data())
             this.setState({allRequests: allRequests})
         })
     }

    keyExtractor = (item,index) => index.tostring()
    
    renderItem=({item,i})=>{
     return(<ListItem key={i} title={item.item} subtitle={item.reason} titleStyle={{color:'black', fontWeight:'bold'}} rightElement={<TouchableOpacity><Text>Donate</Text></TouchableOpacity>} bottomDivider /> ) 
    }
    componentDidMount(){
        this.getAllRequests()
      }
    
      componentWillUnmount(){
        this.requestRef();
      }

      render(){
        return(
          <View style={{flex:1}}>
            <MyHeader title="Donate Books"/>
            <View style={{flex:1}}>
              {
                this.state.allRequests.length === 0

                ?( <View> <Text style={{ fontSize: 20}}>List Of All Requested Books</Text> </View> )
                :( <FlatList keyExtractor={this.keyExtractor} data={this.state.allRequests} renderItem={this.renderItem}/>)       
              }
            </View>
          </View>
        )
      }
    }