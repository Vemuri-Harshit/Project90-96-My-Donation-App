import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity,ScrollView } from 'react-native';
import { ListItem, Header} from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../components/MyHeader';

export default class MyRecievedItemsScreen extends Component{
  constructor(){
    super()
    this.state = {
      userId  : firebase.auth().currentUser.email,
      requestedItemsList : [],
      recievedItemsList : [],
      request_status:'',
      docId:'',
      donotId:'',
      itemName:''
    }
  }

  getRequestedItemsList =()=>{
       db.collection('requested_items').where('user_id','==',this.state.userId).where('request_status','==','requested')
      .onSnapshot((snapshot)=>{
        var requestedItemsList = snapshot.docs.map((doc) => doc.data())
        this.setState({
            requestedItemsList : requestedItemsList
        });
      })
  }

  updateItemStatus =(requestId)=>{
    db.collection('requested_items').where('user_id','==',this.state.userId).where('request_id','==',requestId).get()
    .then(snapshot =>{
      snapshot.docs.map(doc =>{
        db.collection('requested_items').doc(doc.id).update({
          'request_status':'recieved'
        })
      })
    })
    
  }

  getRecievedItemsList =()=>{
    db.collection('requested_items').where('user_id','==',this.state.userId).where('request_status','==','recieved')
    .onSnapshot((snapshot)=>{
        var recievedItemsList = snapshot.docs.map((doc) => doc.data())
        this.setState({
            recievedItemsList : recievedItemsList
        });
        console.log(recievedItemsList)
      })
  }

  sendNotification=(requestId)=>{
    //to get the first name and last name
    db.collection('users').where('email_id','==',this.state.userId).get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        var name = doc.data().first_name
        var lastName = doc.data().last_name
  
        // to get the donor id and book name
        db.collection('all_notifications').where('request_id','==',requestId).get()
        .then((snapshot)=>{
          snapshot.forEach((doc) => {
            this.setState({
             donorId  : doc.data().donor_id,
             itemName :  doc.data().item_name
            })
          })
            //targert user id is the donor id to send notification to the user
            db.collection('all_notifications').add({
              "targeted_user_id" : this.state.donorId,
              "message" : name +" " + lastName + " received the " + this.state.itemName ,
              "notification_status" : "unread",
              "item_name" : this.state.itemName
            })
        })
      })
    })
  }

  componentDidMount(){
    this.getRequestedItemsList()
    this.getRecievedItemsList()
    console.log(this.state.requestedItemsList)
  }


  keyExtractorRequest = (item, index) => index.toString()

  renderRequestedItem = ( {item, i} ) =>{
    return (
      <ListItem
        key={i}
        title={item.item_name}
        subtitle={item.reason}
        titleStyle={{ color: 'black', fontWeight: 'bold' }}
        bottomDivider
        rightElement={
            <TouchableOpacity  onPress={()=>{this.updateItemStatus(item.request_id); this.sendNotification(item.request_id) }}>
                <Text>Item Recieved</Text>
            </TouchableOpacity>
                }
      />
    )
  }

  keyExtractorRecieve = (item, index) => index.toString()

  renderRecievedItem = ( {item, i} ) =>{
    return (
      <ListItem
        key={i}
        title={item.item_name}
        subtitle={item.reason}
        titleStyle={{ color: 'black', fontWeight: 'bold' }}
        bottomDivider       
      />
    )
  }

  render(){
    return(
      <ScrollView style={{flex:1}}>
        <MyHeader title="Requested Items" navigation ={this.props.navigation}/>
        <View style={{flex:1}}>
          {
            this.state.requestedItemsList.length === 0
            ?(
              <View style={styles.subContainer}>
                <Text style={{ fontSize: 20}}>List Of All RequestedItems</Text>
              </View>
            )
            :(
              <FlatList
                keyExtractor={this.keyExtractorRequest}
                data={this.state.requestedItemsList}
                renderItem={this.renderRequestedItem}
              />
            )
          }

        </View>

        <Header  centerComponent={{ text: "Recieved Items", style: { color: 'yellow', fontSize:20,fontWeight:"bold", } }} backgroundColor = "black"/>
        {
            this.state.recievedItemsList.length === 0
            ?(
              <View style={styles.subContainer}>
                <Text style={{ fontSize: 20}}>List Of All Recieved Items</Text>
              </View>
            )
            :(
              <FlatList
                keyExtractor={this.keyExtractorRecieve}
                data={this.state.recievedItemsList}
                renderItem={this.renderRecievedItem}
              />
            )
          }
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  subContainer:{
    flex:1,
    fontSize: 20,
    justifyContent:'center',
    alignItems:'center'
  },
  button:{
    width:100,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     }
  }
})