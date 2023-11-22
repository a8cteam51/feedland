# FeedLand

This plugin uses the [FeedLand](https://feedland.com/) API to show your latest feed items on your site.

## Blocks

This plugin providess two custom blocks to show your feed items from [FeedLand](https://feedland.com/):

### FeedLand Artcasting

This block shows your latest feed items in a gallery layout. When adding the block to a page or post you can input an `.opml` file URL to get the feed from. In this example we're using the [feedcorps.org](https://lists.feedcorps.org/) [artshow.opml](https://lists.feedcorps.org/artshow.opml) file. Feed items are stored in a transient for up to one minute. There is a setting you can adjust in the block sidebar to control how many items to show. It ranges from 1 to 20.

### FeedLand Category News

This block shows your latest feed items in a list layout. Usually added to a sidebar on your blog. The setup is simple and there's two inputs you need to fill: `screenname` and `category`. The `screenname` is the username of the FeedLand user you want to show posts from and the `category` field is for the tab in the river page you want to show. The blocks defaults to [Dave Winer's All tab](https://feedland.com/?river=true&screenname=davewiner&catname=all).

There's also some settings you can use to customize the looks of the block:

- Number of items: How many items to show. Defaults to `5`.
- Display Date: Wether to show the date of the feed item or not. Defaults to `false`.
- Display Excerpt (and Max Number of Words in Excerpt): If set to true, the feed item description will be shown with the number of words you set in the `Max Number of Words in Excerpt` field. Defaults to `55`.

## Installation

Download the latest release from the releases tab and upload it to your WordPress site.
