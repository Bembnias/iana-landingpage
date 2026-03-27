import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import "../styles/FormSection.css";

/* ===========================
   Types & Schema
   =========================== */

const formSchema = z
  .object({
    role: z.string().min(1, "Wybierz opcję z listy"),
    firstName: z.string().min(2, "Imię jest wymagane"),
    lastName: z.string().min(2, "Nazwisko jest wymagane"),
    email: z.email("Podaj poprawny adres e-mail"),
    phone: z.string().min(9, "Podaj poprawny numer telefonu"),
    street: z.string().min(3, "Podaj ulicę i numer"),
    postalCode: z.string().regex(/^\d{2}-\d{3}$/, "Format: XX-XXX"),
    followers: z.string().optional(),
    socialLink: z.string().optional(),
    pharmacyAddress: z.string().optional(),
    pharmacyMotivation: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "Influencer") {
      if (!data.followers || data.followers.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["followers"],
          message: "Podaj liczbę followersów",
        });
      } else if (!/^\d+$/.test(data.followers)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["followers"],
          message: "Podaj liczbę całkowitą",
        });
      }
      if (!data.socialLink || data.socialLink.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["socialLink"],
          message: "Podaj link do profilu",
        });
      }
    }
    if (data.role === "Farmaceuta") {
      if (!data.pharmacyAddress || data.pharmacyAddress.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["pharmacyAddress"],
          message: "Podaj nazwę i adres apteki",
        });
      }
      if (!data.socialLink || data.socialLink.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["socialLink"],
          message: "Podaj link do profilu",
        });
      }
      if (!data.pharmacyMotivation || data.pharmacyMotivation.trim().length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["pharmacyMotivation"],
          message: "Odpowiedz na pytanie (min. 3 znaki)",
        });
      } else if (data.pharmacyMotivation.length > 500) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["pharmacyMotivation"],
          message: "Maksymalnie 500 znaków",
        });
      }
    }
  });

type FormData = z.infer<typeof formSchema>;

interface ImageData {
  src: string;
  width?: number;
  height?: number;
}

interface Props {
  /** Optimized image data (passed from Astro via getImage) */
  images: {
    woman: ImageData;
    leafSeparator: ImageData;
    chevronDown: ImageData;
    chevronDownThick: ImageData;
    supElastycznosc: ImageData;
    kremRozgrzewajacy: ImageData;
    supMobilnosc: ImageData;
    zelChlodzacy: ImageData;
    supOdpornosc: ImageData;
    balsamKojacy: ImageData;
  };
}

/* ===========================
   Card Data
   =========================== */

interface Product {
  linkColor: string;
  image: ImageData;
  title: string;
  subtitle: string;
  subtitleColor: string;
  slug: string;
}

interface CardData {
  products: Product[];
  actionLabel: string;
}

/* ===========================
   Component
   =========================== */

export default function FormSectionIsland({ images }: Props) {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [routineError, setRoutineError] = useState("");
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  /* Auto-select routine card from URL query param (?rutyna=0|1|2) */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const routine = params.get("rutyna");
    if (routine !== null) {
      const index = parseInt(routine, 10);
      if (index >= 0 && index <= 2) {
        setSelectedCard(index);
      }
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      street: "",
      postalCode: "",
      followers: "",
      socialLink: "",
      pharmacyAddress: "",
      pharmacyMotivation: "",
    },
  });

  const selectedRole = watch("role");

  const cards: CardData[] = [
    {
      products: [
        {
          linkColor: "var(--color-orange)",
          image: images.supElastycznosc,
          title: "Suplement diety",
          subtitle: "ELASTYCZNOŚĆ + ENERGIA",
          subtitleColor: "var(--color-orange)",
          slug: "elastycznosc-i-energia",
        },
        {
          linkColor: "var(--color-red)",
          image: images.kremRozgrzewajacy,
          title: "Relaksujący",
          subtitle: "KREM ROZGRZEWAJĄCY",
          subtitleColor: "var(--color-red)",
          slug: "relaksujacy-krem-rozgrzewajacy",
        },
      ],
      actionLabel: "Elastyczność i energia",
    },
    {
      products: [
        {
          linkColor: "var(--color-purple)",
          image: images.supMobilnosc,
          title: "Suplement diety",
          subtitle: "ZDROWE STAWY + DOBRY NASTRÓJ",
          subtitleColor: "var(--color-purple)",
          slug: "zdrowe-stawy-dobry-nastroj",
        },
        {
          linkColor: "var(--color-blue)",
          image: images.zelChlodzacy,
          title: "Intensywnie",
          subtitle: "CHŁODZĄCY ŻEL",
          subtitleColor: "var(--color-blue)",
          slug: "intensywnie-chlodzacy-zel",
        },
      ],
      actionLabel: "Mobilność i spokój",
    },
    {
      products: [
        {
          linkColor: "#2C6492", // Darkened for accessibility
          image: images.supOdpornosc,
          title: "Suplement diety",
          subtitle: "ODPORNOŚĆ CHRZĄSTKI + ZDROWY SEN",
          subtitleColor: "#2C6492",
          slug: "suplement-odpornosc",
        },
        {
          linkColor: "#C47000", // Darkened for accessibility
          image: images.balsamKojacy,
          title: "Kojący",
          subtitle: "BALSAM DO MASAŻU",
          subtitleColor: "#C47000",
          slug: "kojacy-balsam-do-masazu",
        },
      ],
      actionLabel: "Komfort i odpoczynek",
    },
  ];

  const routineLabels = ["Elastyczność i energia", "Mobilność i spokój", "Komfort i odpoczynek"];

  async function onSubmit(data: FormData) {
    if (selectedCard === null) {
      setRoutineError("Wybierz jedną z rutyn");
      return;
    }
    setRoutineError("");

    setSubmitStatus("loading");

    const payload = {
      role: data.role,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      street: data.street,
      postalCode: data.postalCode,
      followers: data.role === "Influencer" ? data.followers || "" : "",
      socialLink: data.socialLink || "",
      pharmacyAddress: data.role === "Farmaceuta" ? data.pharmacyAddress || "" : "",
      pharmacyMotivation: data.role === "Farmaceuta" ? data.pharmacyMotivation || "" : "",
      selectedRoutine: routineLabels[selectedCard],
    };

    try {
      const res = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Server error");

      setSubmitStatus("success");
      reset();
      setSelectedCard(null);
    } catch {
      setSubmitStatus("error");
    }
  }

  return (
    <section className="form-section" id="form-section">
      <div className="form-section__container">
        {/* --- 1. Intro --- */}
        <div className="form-section__intro">
          <img
            src={images.woman.src}
            alt="Kobieta korzystająca z programu testowania IANA"
            className="form-section__intro-image"
            loading="lazy"
            decoding="async"
            width={images.woman.width}
            height={images.woman.height}
          />
          <div>
            <h2 className="form-section__intro-heading">
              STWÓRZ SWOJĄ WŁASNĄ RUTYNĘ I PRZETESTUJ PRODUKTY!
            </h2>
            <p className="form-section__intro-text">
              Jeśli tematyka wellbeing, zdrowia, świadomego życia, sprawności i
              aktywności jest Ci bliska i dzielisz się swoją wiedzą,
              doświadczeniem lub perspektywą w sieci – zapraszamy do{" "}
              <span className="form-section__intro-highlight">
                Programu Testowania iana
              </span>{" "}
              dla kobiet 40+, które chcą mówić o zmianach związanych z upływem
              czasu, nowym etapem życia i transformacją ciała.
            </p>
            <p className="form-section__intro-cta">
              Czujesz, że to przestrzeń dla Ciebie? <br />
              Wypełnij formularz i zgłoś się do testowania.
            </p>
          </div>
        </div>

        {/* --- 2. Form --- */}
        <form
          className="form-section__form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          id="test-program-form"
        >
          <div className="form-section__form-grid">
            {/* Row 1 — Select */}
            <div className="form-section__field">
              <label className="form-section__label" htmlFor="field-role">
                Testuję jako:
              </label>
              <div className="form-section__select-wrapper">
                <select
                  id="field-role"
                  className="form-section__select"
                  {...register("role")}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Wybierz...
                  </option>
                  <option value="Influencer">Influencer</option>
                  <option value="Farmaceuta">Farmaceuta</option>
                </select>
                <img
                  src={images.chevronDownThick.src}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="form-section__select-icon"
                  width={images.chevronDownThick.width}
                  height={images.chevronDownThick.height}
                />
              </div>
              <span className="form-section__error">
                {errors.role?.message}
              </span>
            </div>
            {/* Spacer for 2nd column */}
            <div aria-hidden="true" />

            {/* Row 2 */}
            <div className="form-section__field">
              <label className="form-section__label" htmlFor="field-firstName">
                Imię
              </label>
              <input
                id="field-firstName"
                type="text"
                className="form-section__input"
                placeholder="Imię"
                {...register("firstName")}
              />
              <span className="form-section__error">
                {errors.firstName?.message}
              </span>
            </div>
            <div className="form-section__field">
              <label className="form-section__label" htmlFor="field-lastName">
                Nazwisko
              </label>
              <input
                id="field-lastName"
                type="text"
                className="form-section__input"
                placeholder="Nazwisko"
                {...register("lastName")}
              />
              <span className="form-section__error">
                {errors.lastName?.message}
              </span>
            </div>

            {/* Row 3 */}
            <div className="form-section__field">
              <label className="form-section__label" htmlFor="field-email">
                Adres e-mail
              </label>
              <input
                id="field-email"
                type="email"
                className="form-section__input"
                placeholder="Adres e-mail"
                {...register("email")}
              />
              <span className="form-section__error">
                {errors.email?.message}
              </span>
            </div>
            <div className="form-section__field">
              <label className="form-section__label" htmlFor="field-phone">
                Nr telefonu
              </label>
              <input
                id="field-phone"
                type="tel"
                className="form-section__input"
                placeholder="Nr telefonu"
                {...register("phone")}
              />
              <span className="form-section__error">
                {errors.phone?.message}
              </span>
            </div>

            {/* Row 4 */}
            <div className="form-section__field">
              <label className="form-section__label" htmlFor="field-street">
                Ulica i numer
              </label>
              <input
                id="field-street"
                type="text"
                className="form-section__input"
                placeholder="Ulica i numer"
                {...register("street")}
              />
              <span className="form-section__error">
                {errors.street?.message}
              </span>
            </div>
            <div className="form-section__field">
              <label
                className="form-section__label"
                htmlFor="field-postalCode"
              >
                Kod pocztowy
              </label>
              <input
                id="field-postalCode"
                type="text"
                className="form-section__input"
                placeholder="XX-XXX"
                {...register("postalCode")}
              />
              <span className="form-section__error">
                {errors.postalCode?.message}
              </span>
            </div>

            {/* Row 5 — Conditional fields */}
            {selectedRole === "Influencer" && (
              <>
                <div className="form-section__field">
                  <label
                    className="form-section__label"
                    htmlFor="field-followers"
                  >
                    Liczba followersów
                  </label>
                  <input
                    id="field-followers"
                    type="number"
                    min="0"
                    className="form-section__input"
                    placeholder="np. 10000"
                    {...register("followers")}
                  />
                  <span className="form-section__error">
                    {errors.followers?.message}
                  </span>
                </div>
                <div className="form-section__field">
                  <label
                    className="form-section__label"
                    htmlFor="field-socialLink"
                  >
                    Link do profilu Social Media
                  </label>
                  <input
                    id="field-socialLink"
                    type="url"
                    className="form-section__input"
                    placeholder="https://..."
                    {...register("socialLink")}
                  />
                  <span className="form-section__error">
                    {errors.socialLink?.message}
                  </span>
                </div>
              </>
            )}

            {selectedRole === "Farmaceuta" && (
              <>
                <div className="form-section__field">
                  <label
                    className="form-section__label"
                    htmlFor="field-pharmacyAddress"
                  >
                    Nazwa i adres apteki
                  </label>
                  <input
                    id="field-pharmacyAddress"
                    type="text"
                    className="form-section__input"
                    placeholder="Nazwa i adres apteki"
                    {...register("pharmacyAddress")}
                  />
                  <span className="form-section__error">
                    {errors.pharmacyAddress?.message}
                  </span>
                </div>
                <div className="form-section__field">
                  <label
                    className="form-section__label"
                    htmlFor="field-socialLink-farmaceuta"
                  >
                    Link do profilu Social Media
                  </label>
                  <input
                    id="field-socialLink-farmaceuta"
                    type="url"
                    className="form-section__input"
                    placeholder="https://..."
                    {...register("socialLink")}
                  />
                  <span className="form-section__error">
                    {errors.socialLink?.message}
                  </span>
                </div>
                <div className="form-section__field form-section__field--full">
                  <label
                    className="form-section__label"
                    htmlFor="field-pharmacyMotivation"
                  >
                    <strong>Odpowiedz na pytanie:</strong> Co zainteresowało Cię
                    w produktach marki iana i dlaczego chcesz je przetestować?
                  </label>
                  <textarea
                    id="field-pharmacyMotivation"
                    className="form-section__input form-section__textarea"
                    placeholder="max 500 znaków"
                    maxLength={500}
                    rows={5}
                    {...register("pharmacyMotivation")}
                  />
                  <span className="form-section__error">
                    {errors.pharmacyMotivation?.message}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* --- 3. Steps Banner --- */}
          <div className="form-section__banner">
            <div className="form-section__banner__inner">

              <span className="form-section__banner-step">
                WYBIERZ SWOJĄ RUTYNĘ
              </span>
              <img
                src={images.leafSeparator.src}
                alt=""
                aria-hidden="true"
                className="form-section__banner-leaf"
                loading="lazy"
                decoding="async"
                width={images.leafSeparator.width}
                height={images.leafSeparator.height}
              />
              <span className="form-section__banner-step form-section__banner-step--green">
                PRZETESTUJ
              </span>
              <img
                src={images.leafSeparator.src}
                alt=""
                aria-hidden="true"
                className="form-section__banner-leaf"
                loading="lazy"
                decoding="async"
                width={images.leafSeparator.width}
                height={images.leafSeparator.height}
              />
              <span className="form-section__banner-step">
                PODZIEL SIĘ OPINIĄ
              </span>
            </div>
          </div>

          <div className="form-section__banner-chevron">
            <img
              src={images.chevronDown.src}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              width={images.chevronDown.width}
              height={images.chevronDown.height}
            />
          </div>

          {/* --- 4. Product Cards --- */}
          <div className="form-section__cards">
            {cards.map((card, cardIndex) => (
              <div className="form-section__card" key={cardIndex}>
                <div className="form-section__card-products">
                  {card.products.map((product, pIndex) => (
                    <div className="form-section__product" key={pIndex}>
                      <a
                        href={`/produkty/${product.slug}`}
                        target="_blank"
                        className="form-section__product-link"
                        aria-label={`Poznaj ${product.subtitle}`}
                      >
                        POZNAJ{" "}
                        <span
                          className="form-section__product-arrow"
                          style={{ color: product.linkColor }}
                        >
                          &gt;
                        </span>
                      </a>
                      <img
                        src={product.image.src}
                        alt={product.subtitle}
                        className="form-section__product-image"
                        loading="lazy"
                        decoding="async"
                        width={product.image.width}
                        height={product.image.height}
                      />
                      <div className="form-section__product-info">
                        <span className="form-section__product-title">
                          {product.title}
                        </span>
                        <span
                          className="form-section__product-subtitle"
                          style={{ color: product.subtitleColor }}
                        >
                          {product.subtitle}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="form-section__card-action">
                  <span className="form-section__card-action-label">
                    {card.actionLabel}
                  </span>
                  <button
                    type="button"
                    className={`form-section__btn-select${selectedCard === cardIndex
                      ? " form-section__btn-select--active"
                      : ""
                      }`}
                    onClick={() => {
                      setSelectedCard(
                        selectedCard === cardIndex ? null : cardIndex
                      );
                      setRoutineError("");
                    }}
                  >
                    WYBIERAM
                  </button>
                </div>
              </div>
            ))}
          </div>

          {routineError && (
            <div className="form-section__error" style={{ textAlign: "center", marginTop: "-16px", marginBottom: "16px" }}>
              {routineError}
            </div>
          )}

          {/* --- 5. Submit --- */}
          <div className="form-section__submit-wrapper">
            <button
              type="submit"
              className="form-section__btn-submit"
              disabled={submitStatus === "loading"}
            >
              {submitStatus === "loading"
                ? "WYSYŁANIE..."
                : "WYŚLIJ ZGŁOSZENIE"}
            </button>
          </div>

          {submitStatus === "success" && (
            <div className="form-section__toast form-section__toast--success">
              Dziękujemy za zgłoszenie! Odezwiemy się wkrótce.
            </div>
          )}
          {submitStatus === "error" && (
            <div className="form-section__toast form-section__toast--error">
              Wystąpił błąd. Spróbuj ponownie.
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
