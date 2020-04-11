import { h, Component } from 'preact';

class ListItem extends Component {


  _itemUrl() {
    const { item } = this.props
    if (item.resolved_url) {
      return item.resolved_url;
    }
    return item.given_url;
  }

  _faviconUrl() {
    var url = this._itemUrl();
    return "http://www.google.com/s2/favicons?domain_url=" + encodeURIComponent(url);
  }


  _itemTitle() {
    const { item } = this.props
    var title = '';
    if (item.resolved_title)
      title = item.resolved_title;
    else if (item.given_title)
      title = item.given_title;
    else
      title = this.getItemUrl(item);

    return title.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  _handleMarkAsRead = () => {
    this.props.handleMarkAsRead()
  }

  render() {
    const title = this._itemTitle()
    return (
      <tr className='table_row'>
        <td className='no_border favicon'>
          <span>
            <img src={this._faviconUrl()} className="favicon_img" />
          </span>
        </td>
        <td nowrap='nowrap' className="item_link_td">
          <span>
            <a href={this._itemUrl()} target="_blank" title={title}>{title}</a>
          </span>
        </td>
        <td className="no_border table_img_mark_as_read" title="Mark as Read" onClick={this._handleMarkAsRead}>
          Mark as Read
        </td>

      </tr>
    )
  }
}

export default ListItem;
