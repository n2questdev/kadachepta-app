import { Component, OnInit } from '@angular/core';
import { HomePage } from '../home/home.page';
import { BrowsePage } from '../browse/browse.page';
import { SearchPage } from 'src/app/pages/search/search.page';
import { LibraryPage } from '../library/library.page';


@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage implements OnInit {
  tab1Root = HomePage;
  tab2Root = BrowsePage;
  tab3Root = SearchPage;
  tab4Root = LibraryPage;

  constructor() {}

  ngOnInit() {}
}
