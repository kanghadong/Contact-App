import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, AsyncStorage } from 'react-native';
import { Card, Icon } from 'native-base';

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  static navigationOptions = {
    title: 'Contact App'
  };

  componentWillMount() {
    const { navigation } = this.props;
    navigation.addListener('willFocus', () => {
      this.getAllContact();
    });
  }

  // Todo: get All contacts

  getAllContact = async () => {
    // collectes all data
    await AsyncStorage.getAllKeys()
      .then(keys => {
        return AsyncStorage.multiGet(keys)
          .then(result => {
            this.setState({
              data: result.sort(function (a, b) {
                if (JSON.parse(a[1]).fname < JSON.parse(b[1]).fname) { return -1; }
                if (JSON.parse(a[1]).fname > JSON.parse(b[1]).fname) { return 1; }
                return 0;
              })
            })
          })
          .catch(error => {
            console.log(error);
          })
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <FlatList 
          data={this.state.data}
          renderItem={({item}) => {
            contact = JSON.parse(item[1]);

            return (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('View', {
                    key: item[0].toString()
                  });
                }}
              >
                <Card style={styles.listItem}>
                  <View style={styles.iconContainer}>
                    <Text style={styles.contactIcon}>
                      {contact.fname[0].toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>
                      {contact.fname} {contact.lname}
                    </Text>
                    <Text style={styles.infoText}>
                      {contact.phone}
                    </Text>
                  </View>
                </Card>
              </TouchableOpacity>
            )
          }}
          keyExtractor={(item, index) => item[0].toString()}
        />
        <TouchableOpacity
          style={styles.floatButton}
          onPress={() => {
            this.props.navigation.navigate('Add');
          }}
        >
          <Icon ios='ios-add' android="md-plus" style={{ fontSize: 30, color: '#fff' }} />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  listItem: {
    flexDirection: "row",
    padding: 20
  },
  iconContainer: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#B83227",
    borderRadius: 100
  },
  contactIcon: {
    fontSize: 28,
    color: "#fff"
  },
  infoContainer: {
    flexDirection: "column"
  },
  infoText: {
    fontSize: 16,
    fontWeight: "400",
    paddingLeft: 10,
    paddingTop: 2
  },
  floatButton: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    position: "absolute",
    bottom: 10,
    right: 10,
    height: 60,
    backgroundColor: "#B83227",
    borderRadius: 100
  }
});
