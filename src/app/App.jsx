import { h, Component } from 'preact';
import Header from './Header.jsx'
import List from './List.jsx'

import {
  fetchItems,
  addItem,
  fetchItemsFromCache,
  getSettings,
  archiveItem,
  updateSettings
} from './repo.js'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      items: [],
      settings: {}
    };
  }

  async componentDidMount() {
    const settings = await getSettings()
    let items = await fetchItemsFromCache()
    if (items) {
      this.setState({ items, settings })
    } else {
      items = await fetchItems()
      this.setState({ items, settings })
    }
  }

  _handleAddTab = () => {
    const self = this
    chrome.tabs.getSelected(null, async function (tab) {
      var url = tab.url;
      var title = tab.title;
      await addItem(url, title)
      const items = await fetchItems()
      self.setState({ items })
    });
  }

  _handleSyncItems = async () => {
    const items = await fetchItems()
    this.setState({ items })
  }

  _handleMarkItemAsRead = async (item) => {
    await archiveItem(item.item_id)
    const items = await fetchItems()
    this.setState({ items })
  }

  _handleChangeOrderBy = async (orderBy) => {
    await updateSettings('orderBy', orderBy);
    const settings = await getSettings()
    this.setState({settings})
  }

  render() {
    return (
      <div id="page_body">
        <Header
          handleAddItem={this._handleAddTab}
          handleSyncItems={this._handleSyncItems}
          handleChangeOrderBy={this._handleChangeOrderBy}
          settings={this.state.settings}
        >
        </Header>
        <List
          items={this.state.items || []}
          settings={this.state.settings}
          handleMarkItemAsRead={this._handleMarkItemAsRead}
        ></List>
      </div>
    )
  }
}

export default App;
