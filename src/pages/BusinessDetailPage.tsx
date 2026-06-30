/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LocalBusiness, BusinessProduct, BusinessReview, Language, TranslationDict } from '../types';
import { VoiceInputButton } from '../components/SpeechAccessibility';
import { translateData } from '../translations';
import { 
  ArrowLeft, 
  MapPin, 
  User, 
  Phone, 
  MessageSquare, 
  Star, 
  Plus, 
  Edit3, 
  Trash2, 
  ShoppingBag, 
  Share2, 
  Award,
  Clock,
  Heart,
  FileText,
  Sparkles,
  CheckCircle,
  X
} from 'lucide-react';

interface BusinessDetailPageProps {
  business: LocalBusiness;
  onBack: () => void;
  onUpdateBusiness: (updatedBiz: LocalBusiness) => void;
  lang: Language;
  translations: TranslationDict;
}

export default function BusinessDetailPage({
  business,
  onBack,
  onUpdateBusiness,
  lang,
  translations
}: BusinessDetailPageProps) {
  // Ensure lists exist
  const products = business.products || [];
  const reviews = business.reviews || [];

  // Local state for modals/CRUD forms
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<BusinessProduct | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodAddedBy, setProdAddedBy] = useState('');

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<BusinessReview | null>(null);
  const [revUser, setRevUser] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState('');

  // ---------------------------------------------------------------------------
  // PRODUCT CRUD
  // ---------------------------------------------------------------------------
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdName('');
    setProdPrice('');
    setProdDesc('');
    setProdAddedBy('');
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: BusinessProduct) => {
    setEditingProduct(prod);
    setProdName(prod.name);
    setProdPrice(prod.price.toString());
    setProdDesc(prod.description || '');
    setProdAddedBy(prod.addedBy || '');
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim() || !prodPrice) return;

    let updatedProducts: BusinessProduct[];
    if (editingProduct) {
      // Update
      updatedProducts = products.map(p => p.id === editingProduct.id ? {
        ...p,
        name: prodName,
        price: parseFloat(prodPrice),
        description: prodDesc,
        addedBy: prodAddedBy.trim() || undefined
      } : p);
    } else {
      // Create
      const newProd: BusinessProduct = {
        id: `prod_${Date.now()}`,
        name: prodName,
        price: parseFloat(prodPrice),
        description: prodDesc,
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=200",
        addedBy: prodAddedBy.trim() || undefined
      };
      updatedProducts = [...products, newProd];
    }

    onUpdateBusiness({
      ...business,
      products: updatedProducts
    });
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      const updatedProducts = products.filter(p => p.id !== id);
      onUpdateBusiness({
        ...business,
        products: updatedProducts
      });
    }
  };

  // ---------------------------------------------------------------------------
  // REVIEW CRUD
  // ---------------------------------------------------------------------------
  const handleOpenAddReview = () => {
    setEditingReview(null);
    setRevUser('');
    setRevRating(5);
    setRevComment('');
    setIsReviewModalOpen(true);
  };

  const handleOpenEditReview = (rev: BusinessReview) => {
    setEditingReview(rev);
    setRevUser(rev.userName);
    setRevRating(rev.rating);
    setRevComment(rev.comment);
    setIsReviewModalOpen(true);
  };

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revUser.trim() || !revComment.trim()) return;

    let updatedReviews: BusinessReview[];
    if (editingReview) {
      // Update
      updatedReviews = reviews.map(r => r.id === editingReview.id ? {
        ...r,
        userName: revUser,
        rating: revRating,
        comment: revComment,
        date: new Date().toISOString().split('T')[0]
      } : r);
    } else {
      // Create
      const newRev: BusinessReview = {
        id: `rev_${Date.now()}`,
        userName: revUser,
        rating: revRating,
        comment: revComment,
        date: new Date().toISOString().split('T')[0]
      };
      updatedReviews = [...reviews, newRev];
    }

    // Recalculate average rating
    const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
    const newAverage = parseFloat((totalRating / updatedReviews.length).toFixed(1));

    onUpdateBusiness({
      ...business,
      reviews: updatedReviews,
      rating: newAverage
    });
    setIsReviewModalOpen(false);
  };

  const handleDeleteReview = (id: string) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      const updatedReviews = reviews.filter(r => r.id !== id);
      const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
      const newAverage = updatedReviews.length > 0 ? parseFloat((totalRating / updatedReviews.length).toFixed(1)) : 5.0;

      onUpdateBusiness({
        ...business,
        reviews: updatedReviews,
        rating: newAverage
      });
    }
  };

  return (
    <div id="business-detail-root" className="space-y-6 animate-in fade-in duration-300">
      
      {/* Back Header Bar */}
      <div className="flex items-center justify-between">
        <button
          id="btn-back-to-directory"
          onClick={onBack}
          className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-200 transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </button>

        <div className="bg-purple-100 text-purple-700 text-[10px] px-3 py-1.5 rounded-full font-bold flex items-center gap-1">
          <Award className="w-3.5 h-3.5" />
          <span>Vouched Local Business</span>
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col md:flex-row">
        
        {/* Banner/Photo */}
        <div className="md:w-1/3 h-64 md:h-auto bg-slate-100 relative shrink-0">
          <img 
            src={business.photoUrl} 
            alt={business.name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <span className="absolute top-4 left-4 bg-white/95 text-indigo-700 border border-slate-100 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider shadow-md">
            {translateData(business.id, 'category', business.category, lang)}
          </span>
        </div>

        {/* Business Hero Info details */}
        <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            {/* Title & Rating */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-xl md:text-2xl font-black text-slate-800 leading-tight">
                {translateData(business.id, 'name', business.name, lang)}
              </h2>
              
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 px-3.5 py-1.5 rounded-2xl w-fit font-extrabold text-xs shrink-0 shadow-sm">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{business.rating} / 5.0 Rating</span>
                <span className="text-slate-400 font-normal">({reviews.length})</span>
              </div>
            </div>

            {/* Owner & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                  <User className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">{translations.ownerName}</span>
                  <strong className="text-slate-700 text-xs font-semibold">{business.ownerName}</strong>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-600">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">{translations.location}</span>
                  <strong className="text-slate-700 text-xs font-semibold">
                    {translateData(business.id, 'location', business.location, lang)}
                  </strong>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-600 leading-relaxed pt-2">
              {translateData(business.id, 'description', business.description, lang)}
            </p>
          </div>

          {/* Quick Contact & Action Triggers */}
          <div className="border-t border-slate-100 pt-5 flex flex-wrap gap-3">
            <a
              id="detail-call-owner"
              href={`tel:${business.phoneNumber}`}
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 text-xs font-bold px-5 py-3 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Phone className="w-4 h-4" />
              <span>Call {business.ownerName.split(' ')[0]}</span>
            </a>

            <button
              id="detail-message-owner"
              onClick={() => alert(`Direct connection initiated with ${business.ownerName}. Please use the chat tool to send custom requirements.`)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{translations.messageOwner}</span>
            </button>

            {business.whatsappNumber && (
              <a
                id="detail-whatsapp-owner"
                href={`https://wa.me/${business.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Order via WhatsApp</span>
              </a>
            )}
          </div>

        </div>
      </div>

      {/* Grid: 1. Products CRUD | 2. Reviews CRUD */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* PRODUCTS SECTION (CRUD) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col h-[500px]">
          <div className="border-b border-slate-100 pb-4 mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-indigo-600" />
                Products & Catalog
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Manage item list, prices, and catalogs</p>
            </div>

            {/* Create Product Button */}
            <button
              id="btn-add-product"
              onClick={handleOpenAddProduct}
              className="bg-slate-50 hover:bg-indigo-50 text-indigo-600 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Item</span>
            </button>
          </div>

          {/* Product Items List scrollbox */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {products.length === 0 ? (
              <div className="text-center py-24 text-slate-400 text-xs font-medium border border-dashed border-slate-200 rounded-2xl">
                No products listed yet. Click "Add Item" to launch your store catalog!
              </div>
            ) : (
              products.map((prod) => (
                <div 
                  key={prod.id} 
                  id={`product-item-${prod.id}`}
                  className="bg-slate-50 hover:bg-slate-100/50 border border-slate-200/80 p-3.5 rounded-2xl flex gap-3 group transition-all"
                >
                  <div className="w-14 h-14 rounded-xl bg-indigo-100 shrink-0 overflow-hidden border border-slate-200">
                    <img src={prod.imageUrl || "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=100"} alt={prod.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-800 truncate">{prod.name}</h4>
                        <span className="text-xs font-mono font-extrabold text-indigo-700 shrink-0">₹{prod.price}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">{prod.description}</p>
                      {prod.addedBy && (
                        <p className="text-[9px] text-slate-400 mt-1 italic font-light">Added by: {prod.addedBy}</p>
                      )}
                    </div>

                    {/* Actions: Edit, Delete */}
                    <div className="flex justify-end gap-2 mt-2 border-t border-slate-100/60 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        id={`btn-edit-prod-${prod.id}`}
                        onClick={() => handleOpenEditProduct(prod)}
                        className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 px-2 py-1 rounded hover:bg-indigo-50/50 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        Edit
                      </button>

                      <button
                        id={`btn-del-prod-${prod.id}`}
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="text-[10px] font-bold text-red-600 hover:text-red-800 flex items-center gap-0.5 px-2 py-1 rounded hover:bg-red-50/50 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* REVIEWS SECTION (CRUD) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col h-[500px]">
          <div className="border-b border-slate-100 pb-4 mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Star className="w-4 h-4 text-indigo-600" />
                Neighbor Reviews
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Read or write genuine resident reviews</p>
            </div>

            {/* Add Review Button */}
            <button
              id="btn-add-review"
              onClick={handleOpenAddReview}
              className="bg-slate-50 hover:bg-indigo-50 text-indigo-600 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Write Review</span>
            </button>
          </div>

          {/* Review Items List scrollbox */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {reviews.length === 0 ? (
              <div className="text-center py-24 text-slate-400 text-xs font-medium border border-dashed border-slate-200 rounded-2xl">
                No reviews yet. Be the first neighbor to write a review and support this store!
              </div>
            ) : (
              reviews.map((rev) => (
                <div 
                  key={rev.id} 
                  id={`review-item-${rev.id}`}
                  className="bg-slate-50 hover:bg-slate-100/50 border border-slate-200/80 p-3.5 rounded-2xl space-y-2 group transition-all"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-[10px] font-bold text-indigo-600 uppercase">
                        {rev.userName[0]}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{rev.userName}</h4>
                        <span className="text-[9px] text-slate-400 font-mono">{rev.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-500 text-xs font-bold bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{rev.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-light">{rev.comment}</p>

                  {/* Actions: Edit, Delete */}
                  <div className="flex justify-end gap-2 border-t border-slate-100/60 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      id={`btn-edit-rev-${rev.id}`}
                      onClick={() => handleOpenEditReview(rev)}
                      className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 px-2 py-1 rounded hover:bg-indigo-50/50 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      Edit
                    </button>

                    <button
                      id={`btn-del-rev-${rev.id}`}
                      onClick={() => handleDeleteReview(rev.id)}
                      className="text-[10px] font-bold text-red-600 hover:text-red-800 flex items-center gap-0.5 px-2 py-1 rounded hover:bg-red-50/50 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* -----------------------------------------------------------------------
          PRODUCT MODAL (CREATE / UPDATE)
         ----------------------------------------------------------------------- */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                {editingProduct ? "Edit Product Details" : "Add New Catalog Product"}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Product Name</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="e.g. Traditional Lunch Tiffin"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Price (INR ₹)</label>
                <input
                  type="number"
                  required
                  value={prodPrice}
                  onChange={(e) => setProdPrice(e.target.value)}
                  placeholder="e.g. 150"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Item Description</label>
                  <VoiceInputButton 
                    lang={lang} 
                    onTranscript={(text) => setProdDesc(prev => prev ? `${prev} ${text}` : text)}
                    className="py-1 px-2 border-slate-200"
                  />
                </div>
                <textarea
                  rows={3}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  placeholder="Tell customers what is special about this product..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Your Name (Added By)</label>
                  <VoiceInputButton 
                    lang={lang} 
                    onTranscript={(text) => setProdAddedBy(text)}
                    className="py-1 px-2 border-slate-200"
                  />
                </div>
                <input
                  type="text"
                  required
                  value={prodAddedBy}
                  onChange={(e) => setProdAddedBy(e.target.value)}
                  placeholder="e.g. Girish A."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer shadow-sm"
                >
                  Save Item
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* -----------------------------------------------------------------------
          REVIEW MODAL (CREATE / UPDATE)
         ----------------------------------------------------------------------- */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                {editingReview ? "Edit Your Review" : "Write Customer Review"}
              </h3>
              <button onClick={() => setIsReviewModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveReview} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Your Name</label>
                <input
                  type="text"
                  required
                  value={revUser}
                  onChange={(e) => setRevUser(e.target.value)}
                  placeholder="e.g. Ramesh Gowda"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Star Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRevRating(star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star className={`w-6 h-6 ${
                        star <= revRating 
                          ? 'fill-amber-400 text-amber-400' 
                          : 'text-slate-200'
                      }`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Review Feedback</label>
                <textarea
                  required
                  rows={3}
                  value={revComment}
                  onChange={(e) => setRevComment(e.target.value)}
                  placeholder="Share your genuine experience with the product, quality, delivery, or communication..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer shadow-sm"
                >
                  Submit Review
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
