import { Component, Input, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-retour-produits',
  templateUrl: './retour-produits.component.html',
  styleUrls: ['./retour-produits.component.scss'],
})
export class RetourProduitsComponent implements OnInit {
  @Input() products: Product[];
  @Output() valueChange = new EventEmitter();
  constructor() {}

  ngOnInit() {}
}
