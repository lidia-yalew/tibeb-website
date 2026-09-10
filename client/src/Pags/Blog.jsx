import React, { useEffect, useState } from 'react';
import Navbar from '../Componet/Navbar';
import Footer from '../Componet/Footer';
import SEO from '../Componet/SEO';
import ChatWidget from '../Componet/ChatWidget';
import { getPublishedBlogsApi } from '../services/api';

const categories = [
  "All",
  "Blog",
  "News"
];

function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    getPublishedBlogsApi()
      .then(data => setBlogs(data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const blogList = Array.isArray(blogs) ? blogs : (blogs && Array.isArray(blogs.data) ? blogs.data : []);
  const filteredBlogs = blogList.filter(item => {
    const b = item.post || item;
    const matchesCat = selectedCat === "All" || (b.category && b.category.toLowerCase() === selectedCat.toLowerCase());
    const matchesSearch = !searchQuery.trim() ||
      (b.title && b.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.excerpt && b.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.content && b.content.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <>
      <SEO title="Blog & News | Tibeb Consultancy" />
      
      
      <div className="bg-theme min-h-screen pt-28 pb-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Glassmorphic Toolbar (Replaces Hero) */}
          <div className="sticky top-24 z-30 mb-12 p-3 rounded-[2rem] backdrop-blur-2xl border flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl shadow-primary/5 transition-all duration-300 bg-white/60 dark:bg-[#0a0f2c]/60"
               style={{ borderColor: 'rgba(120, 120, 120, 0.15)' }}>
            
            <div className="flex-1 w-full relative">
              <input
                type="text"
                placeholder="Discover news, insights, and research..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-[1.5rem] bg-card/50 border-none outline-none text-primary placeholder-theme-light text-sm font-bold focus:bg-card focus:ring-2 focus:ring-primary/30 transition-all shadow-inner"
              />
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl opacity-60 filter grayscale">🔍</span>
            </div>

            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide snap-x px-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`snap-center whitespace-nowrap px-6 py-3.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                    selectedCat === cat
                      ? 'bg-card text-theme-light shadow-xl shadow-primary/30 scale-105'
                      : 'bg-card/50 text-theme-light hover:bg-card hover:text-primary hover:shadow-md border border-transparent hover:border-theme'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Main Grid Area */}
          {loading ? (
            // Skeleton Loading
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
               {[...Array(6)].map((_, i) => (
                 <div key={`skeleton-${i}`} className="h-[380px] rounded-[2.5rem] bg-card animate-pulse border border-theme" />
               ))}
            </div>
          ) : filteredBlogs.length === 0 ? (
            // Empty State
            <div className="text-center py-32 rounded-[3rem] border border-theme border-dashed bg-card/30 backdrop-blur-sm">
               <span className="text-6xl mb-4 block animate-bounce">📭</span>
               <h3 className="text-2xl font-black text-primary mb-2">No Articles Found</h3>
               <p className="text-theme-light font-medium">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            // Rich Article Grid
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((item, idx) => {
                const b = item.post || item;
                const images = item.images || [];
                const coverImg = images.find(img => img.is_cover)?.url || images[0]?.url || b.cover_url || "";
                
                const isFeatured = idx === 0 && selectedCat === "All" && !searchQuery;
                return (
                  <div
                    key={b.id || `blog-${idx}`}
                    onClick={() => setSelectedArticle({ ...b, coverImg, images })}
                    className={`group relative overflow-hidden rounded-[2.5rem] bg-card border border-theme cursor-pointer transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_30px_60px_-15px_rgba(26,35,126,0.3)] ${
                      isFeatured ? 'sm:col-span-2 lg:col-span-2 row-span-2 flex flex-col sm:flex-row' : 'flex flex-col'
                    }`}
                  >
                    {/* Abstract Image Placeholder for visual pop */}
                    <div className={`relative overflow-hidden bg-gray-100 ${isFeatured ? 'sm:w-2/5 min-h-[300px]' : 'h-56'}`}>
                      {coverImg ? (
                        <img src={coverImg.trim()} alt={b.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary via-[#283593] to-secondary opacity-95 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1" />
                      )}
                      
                      {/* Subtle geometric overlay pattern */}
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+CjxjaXJjbGUgY3g9IjIiIGN5PSIyIiByPSIyIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSI+PC9jaXJjbGU+Cjwvc3ZnPg==')] opacity-30 pointer-events-none" />
                      
                      <div className="absolute top-5 left-5 z-10">
                         <span className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/20 text-white backdrop-blur-md border border-white/30 shadow-lg">
                           {b.category || "Article"}
                         </span>
                      </div>
                      
                      {isFeatured && (
                         <div className="absolute bottom-5 left-5 right-5 z-10">
                           <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest bg-secondary text-white shadow-2xl">
                             ⭐ Editor's Pick
                           </span>
                         </div>
                      )}
                    </div>

                    <div className={`p-8 sm:p-10 flex flex-col justify-between flex-1 relative bg-card`}>
                      <div>
                        <div className="flex items-center gap-3 text-[10px] font-black text-theme-light uppercase tracking-widest mb-4">
                          <span>{new Date(b.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                          <span>{Math.max(1, Math.ceil((b.content?.length || 0) / 1000))} min read</span>
                        </div>
                        
                        <h3 className={`font-black text-primary leading-[1.2] mb-5 group-hover:text-secondary transition-colors ${
                          isFeatured ? 'text-3xl sm:text-4xl' : 'text-2xl line-clamp-3'
                        }`}>
                          {b.title}
                        </h3>
                        
                        <p className={`text-theme-light leading-relaxed font-medium ${
                          isFeatured ? 'text-base sm:text-lg line-clamp-4' : 'text-sm line-clamp-3'
                        }`}>
                          {b.excerpt || b.content?.substring(0, 150) + '...'}
                        </p>
                      </div>

                      <div className="mt-8 flex items-center justify-between pt-6 border-t border-theme border-dashed">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-black shadow-lg">
                            {(b.author_name || "T")[0].toUpperCase()}
                          </div>
                          <span className="text-xs font-bold text-primary">
                            {b.author_name || "Tibeb Team"}
                          </span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                          →
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Beautiful Article Full View Modal */}
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-theme/60 backdrop-blur-2xl animate-fade-in"
               onClick={() => setSelectedArticle(null)}>
            <div className="bg-card w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden flex flex-col relative scale-in-center"
                 onClick={e => e.stopPropagation()}>
              
              {/* Header Rich Gradient */}
              <div className="h-48 sm:h-72 bg-gradient-to-br from-primary via-[#283593] to-secondary relative shrink-0 overflow-hidden">
                {selectedArticle.coverImg ? (
                  <img src={selectedArticle.coverImg.trim()} alt={selectedArticle.title} className="absolute inset-0 w-full h-full object-cover opacity-90" />
                ) : (
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+CjxjaXJjbGUgY3g9IjIiIGN5PSIyIiByPSIyIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSI+PC9jaXJjbGU+Cjwvc3ZnPg==')] opacity-30" />
                )}
                <div className="absolute inset-0 bg-black/20" />
                
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/20 hover:bg-white text-white hover:text-primary backdrop-blur-xl transition-all duration-300 flex items-center justify-center shadow-2xl text-xl hover:scale-110"
                >
                  ✕
                </button>
              </div>

              {/* Overlapping Content Area */}
              <div className="p-8 sm:p-14 -mt-16 sm:-mt-24 relative bg-card rounded-t-[3rem] overflow-y-auto flex-1 custom-scrollbar shadow-[0_-20px_40px_rgba(0,0,0,0.1)]">
                <div className="inline-flex mb-8 px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest bg-primary text-white shadow-xl shadow-primary/30">
                  {selectedArticle.category || "Article"}
                </div>
                
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-primary leading-[1.1] mb-8 tracking-tight">
                  {selectedArticle.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 sm:gap-6 pb-10 border-b border-theme mb-10 text-sm font-bold text-theme-light">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm shadow-md">
                      {(selectedArticle.author_name || "T")[0].toUpperCase()}
                    </div>
                    <span className="text-primary">{selectedArticle.author_name || "Tibeb Team"}</span>
                  </div>
                  <span className="opacity-50">•</span>
                  <span>{new Date(selectedArticle.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                  {selectedArticle.source && (
                    <>
                      <span className="opacity-50">•</span>
                      <span className="text-secondary px-3 py-1 bg-secondary/10 rounded-lg">{selectedArticle.source}</span>
                    </>
                  )}
                </div>

                <div className="prose prose-lg prose-blue dark:prose-invert max-w-none text-primary/80 leading-[1.8] font-medium text-base sm:text-lg mb-10" dangerouslySetInnerHTML={{ __html: selectedArticle.content || selectedArticle.excerpt }} />

                {selectedArticle.images && selectedArticle.images.filter(img => img.url !== selectedArticle.coverImg).length > 0 && (
                  <div className="mt-8 border-t border-theme pt-8">
                    <h3 className="text-sm font-black text-secondary mb-6 uppercase tracking-wider">Gallery Images</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {selectedArticle.images.filter(img => img.url !== selectedArticle.coverImg).map((img, idx) => (
                        <img key={idx} src={img.url ? img.url.trim() : ''} alt={`Gallery ${idx}`} className="w-full h-40 object-cover rounded-2xl border border-theme shadow-sm hover:scale-105 transition-transform cursor-pointer" onClick={() => window.open(img.url, '_blank')} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
      
      <Footer />

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        .scale-in-center {
          animation: scale-in-center 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
        }
        @keyframes scale-in-center {
          0% {
            transform: scale(0.9);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 20px;
        }
      `}</style>
    </>
  );
}

export default Blog;
