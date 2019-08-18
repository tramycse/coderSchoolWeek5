import React, {Component, useState} from 'react';
import { StyleSheet, Text, View, ActivityIndicator, FlatList } from 'react-native';
import FeedItem from './FeedItem.js';
//import { SearchBar } from 'react-native-elements';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      listArticles: [],
      totalResults: 0,
      pageNumber: 1,
      lastPage: false,
      search: '',
      arrayholder: [],
    };
  }

  getMoreNews = async () => {
    const {pageNumber, listArticles} = this.state;
    const newPage = pageNumber +1;
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&apiKey=cd80d0cfad604c2cbb422355b4a01b85&page=${newPage}`
    );
    const jsonData = await response.json();
    if(jsonData.articles.length>0){
      this.setState ({
        isLoading: false,
        listArticles: listArticles.concat(jsonData.articles),
        arrayholder: jsonData.articles,
        pageNumber: newPage,
        totalResults: jsonData.totalResults
      })
    }
  };

  async componentDidMount() {
    const response = await fetch(
      'https://newsapi.org/v2/top-headlines?country=us&apiKey=cd80d0cfad604c2cbb422355b4a01b85&page=1'
    );
    const jsonData = await response.json();
    this.setState ({
      isLoading: false,
      listArticles: jsonData.articles,
      arrayholder: jsonData.articles,
      totalResults: jsonData.totalResults,
      pageNumber:1
    });
    clear = () => {
      this.search.clear();
    };
  }
  renderItem = ({item}) =>{
    return <FeedItem item = {item}/>
  }

  SearchFilterFunction(text) {
    const {arrayholder} = this.state;
    //passing the inserted text in textinput
    const newData = arrayholder.filter(function(item) {
      //applying filter for the inserted text in search bar
      const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      //setting the filtered newData on datasource
      //After setting the data it will automatically re-render the view
      listArticles: newData,
      search:text,
    });
  }

  render() {
    const {isLoading, listArticles} = this.state;
    if(isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator 
            size="large" 
            animating= {isLoading}/>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.label}>Articles Count:</Text>
          <Text style={styles.info}>{listArticles.length}</Text>
        </View>
        <FlatList
          data= {listArticles}
          renderItem={this.renderItem}
          onEndReached={this.getMoreNews} 
          onRefresh={this.componentDidMount}
          refreshing={false}
          onEndReachedThreshold={1}
          enableEmptySections={true}
          ListFooterComponent={<ActivityIndicator size="large" loading={isLoading} />}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    marginTop: 25,
  },
  label: {
    fontSize: 18,
    color: 'black',
    marginRight: 10,
    fontWeight: 'bold',
    marginLeft: '30%'
  },
  info: {
    fontSize: 18,
    color: 'grey'
  },
});
