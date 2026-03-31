import { useState, useEffect, useCallback, useRef } from "react";
import "../styles/ProductReviews.css";

/* ─── Types ─── */
interface Review {
  _id: string;
  authorName: string;
  authorAvatar: string | null;
  authProvider: string;
  rating: number;
  content: string;
  createdAt: string;
}

interface UserInfo {
  token: string;
  provider: "google" | "facebook";
  name: string;
  avatar: string;
}

interface Props {
  productSlug: string;
}

/* ─── Constants ─── */
const REVIEWS_PER_PAGE = 5;
const MAX_CONTENT_LENGTH = 500;
const MIN_CONTENT_LENGTH = 10;

/* ─── Star SVG ─── */
function StarIcon({
  filled,
  onClick,
  interactive = false,
}: {
  filled: boolean;
  onClick?: () => void;
  interactive?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`star ${filled ? "" : "empty"} ${interactive ? "star-interactive" : ""}`}
      onClick={onClick}
      role={interactive ? "button" : undefined}
      aria-label={interactive ? (filled ? "Zaznaczona gwiazdka" : "Pusta gwiazdka") : undefined}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function StarRating({ rating, count = 5 }: { rating: number; count?: number }) {
  return (
    <div className="review-stars" aria-label={`Ocena: ${rating} na ${count}`}>
      {Array.from({ length: count }, (_, i) => (
        <StarIcon key={i} filled={i < rating} />
      ))}
    </div>
  );
}

/* ─── Google Icon ─── */
function GoogleIcon() {
  return (
    <svg className="auth-btn-icon" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

/* ─── Facebook Icon ─── */
function FacebookIcon() {
  return (
    <svg className="auth-btn-icon" viewBox="0 0 24 24" fill="white">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

/* ─── Close Icon ─── */
function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/* ─── Date formatter ─── */
function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* ─── Loading Skeleton ─── */
function ReviewsSkeleton() {
  return (
    <div className="reviews-skeleton">
      {[0, 1, 2].map((i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-avatar" />
          <div className="skeleton-body">
            <div className="skeleton-line short" />
            <div className="skeleton-line long" />
            <div className="skeleton-line medium" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Auth Modal ─── */
function AuthModal({
  onClose,
  onGoogleCredential,
  onFacebookLogin,
  loading,
  googleClientId,
}: {
  onClose: () => void;
  onGoogleCredential: (credential: string) => void;
  onFacebookLogin: () => void;
  loading: boolean;
  googleClientId: string;
}) {
  const googleBtnRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Render Google Sign-In button
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const googleApi = (window as any).google;
    if (!googleApi || !googleBtnRef.current || !googleClientId) return;

    googleApi.accounts.id.initialize({
      client_id: googleClientId,
      callback: (response: { credential: string }) => {
        onGoogleCredential(response.credential);
      },
    });

    googleApi.accounts.id.renderButton(googleBtnRef.current, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: "continue_with",
      shape: "pill",
      width: 360,
      locale: "pl",
    });
  }, [googleClientId, onGoogleCredential]);

  return (
    <div className="auth-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="auth-modal" role="dialog" aria-label="Zaloguj się, aby dodać opinię">
        <button className="auth-modal-close" onClick={onClose} aria-label="Zamknij">
          <CloseIcon />
        </button>
        <h3 className="auth-modal-title">Dodaj opinię</h3>
        <p className="auth-modal-subtitle">
          Zaloguj się, aby podzielić się swoją opinią o produkcie
        </p>
        <div className="auth-buttons">
          {googleClientId ? (
            <div ref={googleBtnRef} className="google-btn-container" />
          ) : null}
          <button
            className="auth-btn auth-btn-facebook"
            onClick={onFacebookLogin}
            disabled={loading}
          >
            <FacebookIcon />
            Kontynuuj z Facebook
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Review Form ─── */
function ReviewForm({
  user,
  onSubmit,
  onCancel,
  submitting,
}: {
  user: UserInfo;
  onSubmit: (rating: number, content: string) => void;
  onCancel: () => void;
  submitting: boolean;
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState("");

  const isValid = rating >= 1 && content.trim().length >= MIN_CONTENT_LENGTH && content.length <= MAX_CONTENT_LENGTH;

  return (
    <div className="review-form-section">
      <div className="review-form-header">
        <div className="review-form-user">
          {user.avatar ? (
            <img src={user.avatar} alt="" className="review-form-user-avatar" referrerPolicy="no-referrer" />
          ) : (
            <div className="review-avatar-placeholder">{user.name.charAt(0).toUpperCase()}</div>
          )}
          <span className="review-form-user-name">{user.name}</span>
        </div>
        <button className="review-form-logout" onClick={onCancel}>
          Anuluj
        </button>
      </div>

      <div className="review-form-rating">
        <p className="review-form-rating-label">Twoja ocena:</p>
        <div
          className="review-form-stars"
          onMouseLeave={() => setHoverRating(0)}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <StarIcon
              key={i}
              filled={i < (hoverRating || rating)}
              interactive
              onClick={() => setRating(i + 1)}
            />
          ))}
        </div>
      </div>

      <textarea
        className="review-form-textarea"
        placeholder="Podziel się swoją opinią o produkcie... (min. 10 znaków)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={MAX_CONTENT_LENGTH + 50}
        disabled={submitting}
      />

      <p className={`review-form-char-count ${content.length > MAX_CONTENT_LENGTH ? "over-limit" : ""}`}>
        {content.length}/{MAX_CONTENT_LENGTH}
      </p>

      <div className="review-form-actions">
        <button
          className="review-form-submit"
          disabled={!isValid || submitting}
          onClick={() => onSubmit(rating, content.trim())}
        >
          {submitting ? "Wysyłanie..." : "WYŚLIJ OPINIĘ"}
        </button>
        <button className="review-form-cancel" onClick={onCancel} disabled={submitting}>
          ANULUJ
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════ */
export default function ProductReviews({ productSlug }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(REVIEWS_PER_PAGE);

  // Auth state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  /* ─── Fetch Reviews ─── */
  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/get-reviews?product=${encodeURIComponent(productSlug)}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setReviews(data.reviews || []);
      setTotalReviews(data.totalReviews || 0);
      setAverageRating(data.averageRating || 0);
    } catch {
      // Silently fail — show empty state
    } finally {
      setLoading(false);
    }
  }, [productSlug]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  /* ─── Google Credential Callback ─── */
  const googleClientId = (import.meta.env as Record<string, string>)?.PUBLIC_GOOGLE_CLIENT_ID || "";

  const handleGoogleCredential = useCallback((credential: string) => {
    try {
      const payload = JSON.parse(atob(credential.split(".")[1]));
      setUser({
        token: credential,
        provider: "google",
        name: payload.name || payload.given_name || "Użytkownik",
        avatar: payload.picture || "",
      });
      setShowAuthModal(false);
      setShowForm(true);
    } catch {
      setMessage({ type: "error", text: "Błąd logowania Google" });
      setShowAuthModal(false);
    }
  }, []);

  /* ─── Facebook Login ─── */
  const handleFacebookLogin = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const FB = (window as any).FB;

    if (!FB) {
      setMessage({ type: "error", text: "Logowanie Facebook jest chwilowo niedostępne" });
      setShowAuthModal(false);
      return;
    }

    setAuthLoading(true);

    FB.login(
      (response: { status: string; authResponse?: { accessToken: string } }) => {
        if (response.status === "connected" && response.authResponse) {
          const accessToken = response.authResponse.accessToken;

          FB.api(
            "/me",
            { fields: "name,email,picture.width(96).height(96)" },
            (userResponse: { name?: string; picture?: { data?: { url?: string } } }) => {
              setUser({
                token: accessToken,
                provider: "facebook",
                name: userResponse.name || "Użytkownik",
                avatar: userResponse.picture?.data?.url || "",
              });
              setShowAuthModal(false);
              setShowForm(true);
              setAuthLoading(false);
            },
          );
        } else {
          setAuthLoading(false);
        }
      },
      { scope: "public_profile,email" },
    );
  }, []);



  /* ─── Submit Review ─── */
  const handleSubmit = useCallback(
    async (rating: number, content: string) => {
      if (!user) return;

      setSubmitting(true);
      setMessage(null);

      try {
        const res = await fetch("/api/submit-review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: user.token,
            provider: user.provider,
            productSlug,
            rating,
            content,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          setMessage({
            type: "success",
            text: "Dziękujemy za opinię! Twoja recenzja oczekuje na zatwierdzenie przez moderatora.",
          });
          setShowForm(false);
          setUser(null);
          // Don't refetch — pending reviews won't show up anyway
        } else if (res.status === 409) {
          setMessage({
            type: "info",
            text: data.error || "Już dodałeś opinię do tego produktu.",
          });
          setShowForm(false);
          setUser(null);
        } else {
          setMessage({
            type: "error",
            text: data.error || "Nie udało się dodać opinii. Spróbuj ponownie.",
          });
        }
      } catch {
        setMessage({
          type: "error",
          text: "Błąd połączenia. Sprawdź internet i spróbuj ponownie.",
        });
      } finally {
        setSubmitting(false);
      }
    },
    [user, productSlug],
  );

  /* ─── Cancel form ─── */
  const handleCancel = useCallback(() => {
    setShowForm(false);
    setUser(null);
    setMessage(null);
  }, []);

  /* ─── Render ─── */
  const visibleReviews = reviews.slice(0, visibleCount);
  const hasMore = visibleCount < reviews.length;

  return (
    <section className="reviews-section" id="reviews-section" aria-label="Opinie o produkcie">
      <div className="reviews-divider" />

      <header className="reviews-header">
        <span className="reviews-pill">Opinie</span>

        {!loading && totalReviews > 0 && (
          <div className="reviews-summary">
            <span className="reviews-average">{averageRating.toFixed(1)}</span>
            <div className="reviews-stars-summary">
              {Array.from({ length: 5 }, (_, i) => (
                <StarIcon key={i} filled={i < Math.round(averageRating)} />
              ))}
            </div>
            <span className="reviews-count">
              ({totalReviews} {totalReviews === 1 ? "opinia" : totalReviews < 5 ? "opinie" : "opinii"})
            </span>
          </div>
        )}
      </header>

      {/* Reviews list */}
      {loading ? (
        <ReviewsSkeleton />
      ) : reviews.length > 0 ? (
        <>
          <div className="reviews-list">
            {visibleReviews.map((review, index) => (
              <article
                className="review-card"
                key={review._id}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {review.authorAvatar ? (
                  <img
                    src={review.authorAvatar}
                    alt=""
                    className="review-avatar"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                ) : (
                  <div className="review-avatar-placeholder">
                    {review.authorName.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="review-body">
                  <div className="review-meta">
                    <span className="review-author">{review.authorName}</span>
                    <StarRating rating={review.rating} />
                    <span className="review-date">{formatDate(review.createdAt)}</span>
                  </div>
                  <p className="review-content">{review.content}</p>
                </div>
              </article>
            ))}
          </div>

          {hasMore && (
            <button
              className="reviews-show-more"
              onClick={() => setVisibleCount((prev) => prev + REVIEWS_PER_PAGE)}
            >
              POKAŻ WIĘCEJ
            </button>
          )}
        </>
      ) : (
        <p className="reviews-empty">
          Brak opinii dla tego produktu. Bądź pierwszą osobą, która podzieli się swoją opinią!
        </p>
      )}

      {/* Messages */}
      {message && (
        <div className={`review-message ${message.type}`} role="alert">
          {message.text}
        </div>
      )}

      {/* Review Form (logged in) */}
      {showForm && user && (
        <ReviewForm
          user={user}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitting={submitting}
        />
      )}

      {/* Add review CTA */}
      {!showForm && (
        <div className="add-review-cta">
          <button className="add-review-btn" onClick={() => setShowAuthModal(true)}>
            DODAJ OPINIĘ
          </button>
        </div>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => {
            setShowAuthModal(false);
            setAuthLoading(false);
          }}
          onGoogleCredential={handleGoogleCredential}
          onFacebookLogin={() => {
            setMessage(null);
            handleFacebookLogin();
          }}
          loading={authLoading}
          googleClientId={googleClientId}
        />
      )}
    </section>
  );
}
