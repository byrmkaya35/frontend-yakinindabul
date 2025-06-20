import React, { useState, useEffect } from 'react';

const CategorySelectorFullScreen = ({ onChange }) => {
  const [categories, setCategories] = useState([]);
  const [path, setPath] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch('/categories.json')
      .then(res => res.json())
      .then(setCategories);
  }, []);

  // Sadece alt kategori olmayanları arama sonuçlarına ekle
  const searchAllCategories = (categories, query, currentPath = []) => {
    let results = [];
    for (const cat of categories) {
      const newPath = [...currentPath, cat.name];
      if (
        cat.name.toLowerCase().includes(query.toLowerCase()) &&
        (!cat.subcategories || cat.subcategories.length === 0)
      ) {
        results.push(newPath);
      }
      if (cat.subcategories && cat.subcategories.length > 0) {
        results = results.concat(searchAllCategories(cat.subcategories, query, newPath));
      }
    }
    return results;
  };

  // Şu anki seviyede gösterilecek liste
  const getCurrentList = () => {
    let list = categories;
    path.forEach(item => {
      list = list[item.index]?.subcategories || [];
    });
    return list;
  };

  // Arama: Tüm ağaçta alt kategori olmayanları getir, sadece son kategori adı göster
  const getFilteredList = () => {
    if (!search) return getCurrentList();
    const results = searchAllCategories(categories, search);
    return results.map(pathArr => ({
      label: pathArr[pathArr.length - 1], // sadece en son kategori adı göster
      pathArr
    }));
  };

  const handleSelect = (item, idx, fromSearch) => {
    if (fromSearch) {
      setSelected(item.pathArr);
      setOpen(false);
      if (onChange) onChange(item.pathArr.join(' > '));
      setPath([]);
      setSearch('');
    } else {
      const newPath = [...path, { name: item.name, index: idx }];
      setSearch('');
      if (item.subcategories && item.subcategories.length > 0) {
        setPath(newPath);
      } else {
        setPath(newPath);
        setSelected(newPath.map(p => p.name));
        setOpen(false);
        if (onChange) onChange(newPath.map(p => p.name).join(' > '));
      }
    }
  };

  const handleBack = () => {
    setSearch('');
    setPath(path.slice(0, -1));
  };

  const handleClear = () => {
    setSearch('');
    setPath([]);
    setSelected(null);
    if (onChange) onChange('');
  };

  const selectionPath = (selected || []).join(' > ');

  const handleOpen = () => {
    setOpen(true);
    setSearch('');
    setPath([]);
  };

  const maxWidth = 600;

  return (
    <div style={{ width: '100%' }}>
      <label style={{
        fontWeight: 500, fontSize: 14, color: '#474d66', marginBottom: 5, display: 'block'
      }}>
        Kategori Seçiniz <span style={{ color: '#F24E1E' }}>*</span>
      </label>
      <div
        style={{
          border: '1px solid #D6D8E7',
          borderRadius: 8,
          minHeight: 40,
          padding: '10px 14px',
          fontSize: 16,
          color: selected ? '#10162F' : '#C2C4D6',
          background: '#fff',
          cursor: 'pointer',
          marginBottom: 8
        }}
        onClick={handleOpen}
        tabIndex={0}
      >
        {selectionPath || 'Kategori seçiniz'}
      </div>

      {open && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(255,255,255,0.97)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingTop: 50,
        }}>
          {/* Üstte seçim yolu + kapat */}
          <div style={{
            width: '100%',
            maxWidth,
            margin: '0 auto 18px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ fontSize: 18, fontWeight: 500, color: '#1787F3', paddingLeft: 10 }}>
              {path.length > 0 ? (
                path.map((p, i) => (
                  <span key={p.name}>
                    {p.name}
                    {i < path.length - 1 && <span style={{ color: '#bbb' }}> › </span>}
                  </span>
                ))
              ) : 'Kategori seçiniz'}
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 24,
                color: '#474d66',
                cursor: 'pointer',
                padding: 10
              }}
              aria-label="Kapat"
            >✕</button>
          </div>

          {/* Arama kutusu */}
          <input
            type="text"
            placeholder="Kategori ara..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              maxWidth,
              margin: '0 auto 12px auto',
              padding: '12px 14px',
              borderRadius: 8,
              border: '1px solid #D6D8E7',
              fontSize: 16
            }}
            autoFocus
          />

          {/* Kategori listesi */}
          <div style={{
            width: '100%',
            maxWidth,
            background: '#fff',
            borderRadius: 10,
            boxShadow: '0 4px 20px 0 rgba(0,0,0,.07)',
            maxHeight: 340,
            overflowY: 'auto',
            marginBottom: 20
          }}>
            {/* Eğer arama yapılıyorsa global arama sonuçlarını göster */}
            {search ? (
              getFilteredList().length > 0 ? getFilteredList().map((item, idx) => (
                <div
                  key={item.label + idx}
                  onClick={() => handleSelect(item, idx, true)}
                  style={{
                    padding: '16px 14px',
                    borderBottom: '1px solid #F2F4F7',
                    cursor: 'pointer',
                    fontSize: 17,
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <span>{item.label}</span>
                </div>
              )) : (
                <div style={{ color: '#D0D5DD', padding: 16 }}>Kategori bulunamadı.</div>
              )
            ) : (
              getCurrentList().map((item, idx) => (
                <div
                  key={item.name}
                  onClick={() => handleSelect(item, idx)}
                  style={{
                    padding: '16px 14px',
                    borderBottom: '1px solid #F2F4F7',
                    cursor: 'pointer',
                    fontSize: 17,
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <span>{item.name}</span>
                  {item.subcategories && item.subcategories.length > 0 && (
                    <span style={{ color: '#bbb', marginLeft: 'auto', fontSize: 18 }}>›</span>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Butonlar */}
          <div style={{
            width: '100%',
            maxWidth,
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            {path.length > 0 ? (
              <>
                <button
                  onClick={handleBack}
                  style={{
                    padding: '10px 30px',
                    borderRadius: 6,
                    border: 'none',
                    background: '#F2F4F7',
                    color: '#1787F3',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: 16
                  }}
                >
                  Geri
                </button>
                <button
                  onClick={handleClear}
                  style={{
                    padding: '10px 30px',
                    borderRadius: 6,
                    border: 'none',
                    background: '#F2F4F7',
                    color: '#D92D20',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: 16
                  }}
                >
                  Temizle
                </button>
              </>
            ) : (
              <div />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelectorFullScreen;
