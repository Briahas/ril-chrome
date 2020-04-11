import { h, Component } from 'preact';

class Header extends Component {

  _handleAdd = () => {
    this.props.handleAddItem()
  }

  _handleSync = () => {
    this.props.handleSyncItems()
  }

  _handleOrderBy = (ev) => {
    this.props.handleChangeOrderBy(ev.target.value)
  }

  _render

  render() {
    return (
        <header style="position: relative;">
          <input id='iwillril_search' type='text' size='25'></input>
          <span id="add_button" className="icon_header icon icon-bookmark" title="Add" onClick={this._handleAdd}>Add</span>
          <span id="sync_button" className="icon_header icon icon-refresh" title="Sync" onClick={this._handleSync}>Sync</span>
          <span id="option_footer" className='icon_header icon icon-wrench' title="Settings">Set</span>
          <div id="order_select_div">
            <select id="order_select" onChange={this._handleOrderBy} value={this.props.settings.orderBy}>
              <option value="old">Oldest</option>
              <option value="new">Newest</option>
            </select>
          </div>
        </header>
    )
  }
}

export default Header;
