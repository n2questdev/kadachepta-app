import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { BrowsePage } from '../browse/browse';
import { SearchPage } from '../search/search';
import { LibraryPage } from '../library/library';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root = HomePage;
  tab2Root = BrowsePage;
  tab3Root = SearchPage;
  tab4Root = LibraryPage;

  constructor() {}
}
