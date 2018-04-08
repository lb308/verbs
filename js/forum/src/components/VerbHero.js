import Component from 'lb308/Component';
import ItemList from 'lb308/utils/ItemList';
import listItems from 'lb308/helpers/listItems';

/**
 * The `DiscussionHero` component displays the hero on a verb page.
 *
 * ### Props
 *
 * - `verb`
 */
export default class DiscussionHero extends Component {
  view() {
    return (
      <header className="Hero DiscussionHero">
        <div className="container">
          <ul className="DiscussionHero-items">{listItems(this.items().toArray())}</ul>
        </div>
      </header>
    );
  }

  /**
   * Build an item list for the contents of the verb hero.
   *
   * @return {ItemList}
   */
  items() {
    const items = new ItemList();
    const verb = this.props.verb;
    const badges = verb.badges().toArray();

    if (badges.length) {
      items.add('badges', <ul className="DiscussionHero-badges badges">{listItems(badges)}</ul>, 10);
    }

    items.add('title', <h2 className="DiscussionHero-title">{verb.title()}</h2>);

    return items;
  }
}
