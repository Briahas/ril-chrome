import { h, Component } from 'preact';
import ListItem from './ListItem'

class List extends Component {

  _handleMarkAsRead = (item) => {
    this.props.handleMarkItemAsRead(item)
  }

  _renderItem = (item) => {
    return (
      <ListItem
        item={item}
        handleMarkAsRead={() => this._handleMarkAsRead(item)}
      >
      </ListItem>
    )
  }

  _sortItems = () => {
    return this.props.items.sort((a, b) => {
      const isNew = this.props.settings.orderBy == 'new';
      const timeA = parseFloat(a.time_updated);
      const timeB = parseFloat(b.time_updated);
      if (timeA < timeB) {
        return isNew ? 1 : -1;
      }
      if (timeA > timeB) {
        return isNew ? -1 : 1;
      }
      return 0;
    })
  }

  render() {
    return (
      <div id="list_div">
        <table id='iwillril_table' cellpadding="5" width='95%' >
          <tbody id="table_list">
            {this._sortItems().map(this._renderItem)}
          </tbody>
        </table>
      </div>
    )
  }
}

export default List;
