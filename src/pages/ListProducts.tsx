import React, { useState, useEffect } from 'react';
import '../styles/ListProducts.css';

export default function ListProducts() {
  const [categories, setCategories] = useState<any>([]);
  const [products, setProducts] = useState<any>([]);
  const [filteredProducts, setFilteredProducts] = useState<any>([]);
  const [idChecked, setIdsCheckeds] = useState<any>([]);
 
  function getData() {
    fetch('./products.json', {
      headers: {
        Accept: "application/json"
      }
    }).then((res: any) => res.json()).then((res: any) => {
      setProducts(res.data.nodes);
      setFilteredProducts(res.data.nodes);
      const filtedCategories = Array.from(new Map(res.data.nodes.map((item: any) => [item.category["_id"], { _id: item.category._id, name: item.category.name}])).values());
      setCategories(filtedCategories);
    });
  }

  function handleProducts(idCategory: string) {
    if (idChecked.indexOf(idCategory) === -1) {
      setIdsCheckeds([...idChecked, idCategory]);
      const filterProducts = products.filter((product: any) => {
        return product.category._id === idCategory;
      });
      setFilteredProducts(filterProducts);
    } else {
      idChecked.splice(idCategory, 1)
      setFilteredProducts(products);
    }
  }
  
  useEffect(() => {
    getData();
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="labels">
          O que você está procurando?
        </h1>
      </header>
      <main className="main">
      <aside className="aside">
        <h2 className="labels">Filtros</h2>
        {categories.map((category: any) => {
          return (
            <div>
            <input className="option" type="radio" key={category._id} value={category._id} name="category" onChange={(e) => handleProducts(e.target.value)}/>
            <label className="labels">{category.name}</label>
            </div>
          )
        })}
      </aside>
      <section className="section">
        {filteredProducts.map((product: any) => {
          return (
            <div className="cardProduct">
              <img src={product.images[0].asset.url} alt={product.images[0].alt} width="80%" height="70%"/>
              <p className="labelCard" >{product.name}</p>
            </div>
          )
        })}
      </section>
      </main>
    </div>
  );
}
