export default class Table {

  render(list) {
    const self = this
    var list_content = "";
    for(var i = 0; i < list.length; i++)
    {
      var item = list[i];
      item.index = i;
      var html = this.getItemHtml(item);
      list_content += html;
    }

    document.querySelector('#table_list').innerHTML = list_content;
    document.querySelectorAll('.table_img_mark_as_read').forEach(function (elem) {
      elem.removeEventListener('click', self.markAsRead.bind(elem));
      elem.addEventListener('click', self.markAsRead.bind(elem));
    })
    document.querySelectorAll('.item_link_td').forEach(function (elem) {
      elem.removeEventListener('click', self.tryToMarkAsRead.bind(elem));
      elem.addEventListener('click', self.tryToMarkAsRead.bind(elem));
    })
  }

  markAsRead() {
    var item_id = this.getAttribute('item_id');
    var id = this.getAttribute('index');
    this.changeElemStyle(id);
    if(localStorage['deleteItensOption'] === 'true'){
      Request.delete(refreshList, parseInt(item_id));

    }else{
      Request.archieve(refreshList, parseInt(item_id));
    }
  }

  tryToMarkAsRead() {
    if(localStorage["mark_auto_iwillril"] == "true"){
      var bg = chrome.extension.getBackgroundPage();
      var item_id = this.getAttribute('item_id');
      Request.archieve(bg.Background.updateContent, parseInt(item_id));
    }
  }

  getItemHtml(item) {
    var title = this.getItemTitle(item);

    var actionIcon = 'icon-ok';
    if(localStorage['deleteItensOption'] === 'true'){
      actionIcon = 'icon-remove';
    }
    return `
      <tr class="table_row" id="line_index_${item.index}">
        <td class="no_border favicon">
        <span>
          <img src="${this.getFaviconUrl(item)}" id="favicon_index_${item.index}" class="favicon_img" />
        </span>
        </td>
        <td nowrap='nowrap' class="item_link_td" item_id="${item.item_id}">
        <span id="title_span_index_${item.index}">
          <a href="${this.getItemUrl(item)}" target="_blank" title="${title}">${title}</a>
        </span>
        </td>
        <td class="no_border table_img_mark_as_read ${actionIcon}" id="list_img_index_${item.index}" item_id="${item.item_id}" index="${item.index}" title="Mark as Read">
          Mark as Read
        </td>
      </tr>`;
  }

  getFaviconUrl(item) {
    var url = this.getItemUrl(item);
     return "http://www.google.com/s2/favicons?domain_url="+ encodeURIComponent(url);
  }

  getItemTitle(item) {
    var title = '';
    if(item.resolved_title)
      title = item.resolved_title;
    else if(item.given_title)
      title =  item.given_title;
    else
      title = this.getItemUrl(item);

    return title.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  getItemUrl(item) {
    if(item.resolved_url){
      return item.resolved_url;
    }
    return item.given_url;
  }


  changeElemStyle(id) {
    if(document.getElementById("list_img_index_"+id))
    {
      document.getElementById("list_img_index_"+id).style.backgroundImage="url('images/uncheck.png')";
      var elem = document.getElementById("line_index_"+id);
      elem.style.opacity = 0.3;
      elem.style.textDecoration = "line-through";
    }
  }
}

