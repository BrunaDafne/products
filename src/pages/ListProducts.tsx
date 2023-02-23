import { useState, useEffect } from 'react';
import '../styles/ListProducts.css';
import  { Delete } from '@mui/icons-material';

export default function ListProducts() {
  const [categories, setCategories] = useState<any>([]);
  const [products, setProducts] = useState<any>([]);
  const [filteredProducts, setFilteredProducts] = useState<any>([]);
  const [optionSelect, setOptionSelect] = useState(false);
 
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
    const filterProducts = products.filter((product: any) => {
      return product.category._id === idCategory;
    });
    setFilteredProducts(filterProducts);
  }

  function searchProducts(nameProduct: string) {
    if (nameProduct !== "") {
      const results = filteredProducts.filter((product: any) => {
        return product.name.toUpperCase().indexOf(nameProduct.toUpperCase()) !== -1;
      });
      setFilteredProducts(results);
    } else {
      console.log("VALOR DE ELSE")
      var isOptionSelect = false;
      var options = document.getElementsByName("category");
      for(var i=0; i < options.length; i++) {
        //@ts-ignore
        if (options[i].checked) {
          //@ts-ignore
          handleProducts(options[i].value);
          isOptionSelect = true;
        }
      }
      if(!isOptionSelect) {
        setFilteredProducts(products);
      }
    }
  }

  function removeChecked() {
    var options = document.getElementsByName("category");
    for(var i=0; i < options.length; i++) {
      //@ts-ignore
       options[i].checked = false;
    }
    setOptionSelect(false);
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
        <input type="search" name="search" onChange={(e) => searchProducts(e.target.value)}/>
        <header className='asideTitle'>
        <h2 className="labels">Filtros</h2>
        {
          optionSelect && 
          <button onClick={() => {
            setFilteredProducts(products);
            removeChecked();
          }}><Delete /></button>
        }
       
        </header> 
        {categories.map((category: any) => {
          return (
            <div>
            <input className="option" type="radio" key={category._id} value={category._id} onClick={() => !optionSelect && setOptionSelect(true)}name="category" onChange={(e) => handleProducts(e.target.value)}/>
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
