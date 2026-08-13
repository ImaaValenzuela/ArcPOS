import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { colors, spacing } from "./theme/colors";

type Currency = "ARS" | "USDC";
type Screen = "charge" | "review" | "qr" | "success";
type OnboardingScreen = "welcome" | "signin" | "account" | "wallet" | "store" | "preference" | "summary" | "ready";

const keypad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ",", "0", "⌫"];

const categories = ["Gastronomía", "Tienda", "Servicios", "Otro"];

const steps = ["Tu comercio", "Preferencia", "Resumen"];

function formatAmount(value: string) {
  if (!value) return "0";
  const [integer, decimal] = value.split(",");
  const formattedInteger = Number(integer || 0).toLocaleString("es-AR");
  return decimal === undefined ? formattedInteger : `${formattedInteger},${decimal.slice(0, 2)}`;
}

function Header({ onBack }: { onBack?: () => void }) {
  return (
    <View style={styles.header}>
      {onBack ? (
        <Pressable accessibilityLabel="Volver" onPress={onBack} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
      ) : (
        <View style={styles.logoMark}><Text style={styles.logoText}>A</Text></View>
      )}
      <View style={styles.headerCopy}>
        <Text style={styles.brand}>ArcPOS</Text>
        <Text style={styles.store}>Café del Parque</Text>
      </View>
      <View style={styles.online}><View style={styles.onlineDot} /><Text style={styles.onlineText}>Listo</Text></View>
    </View>
  );
}

function StepIndicator({ current }: { current: number }) {
  return (
    <View style={styles.steps}>
      {steps.map((label, index) => {
        const active = index <= current;
        const isNow = index === current;
        return (
          <View key={label} style={styles.stepItem}>
            <View style={[styles.stepDot, active && styles.stepDotActive, isNow && styles.stepDotNow]}>{isNow ? <View style={styles.stepDotInner} /> : active ? <Text style={styles.stepDotCheck}>✓</Text> : null}</View>
            <Text style={[styles.stepLabel, isNow && styles.stepLabelNow]}>{label}</Text>
          </View>
        );
      })}
    </View>
  );
}

function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <View style={styles.onboardCenter}>
      <View style={styles.heroMark}><Text style={styles.heroMarkText}>A</Text></View>
      <Text style={styles.onboardEyebrow}>BIENVENIDO A ARCPOS</Text>
      <Text style={styles.onboardTitle}>Cobrá desde tu teléfono.</Text>
      <Text style={styles.onboardSubtitle}>Pesos, dólares digitales y un solo lugar para llevar tus cobros. Sin tarjeta de presentación, sin vueltas.</Text>
      <View style={styles.featureRow}><View style={styles.featureIcon}><Text style={styles.featureIconText}>QR</Text></View><Text style={styles.featureText}>Mostrá un código y el cliente paga desde su billetera.</Text></View>
      <View style={styles.featureRow}><View style={styles.featureIcon}><Text style={styles.featureIconText}>$</Text></View><Text style={styles.featureText}>Cobrá en pesos o dólares digitales, como prefieras.</Text></View>
      <View style={styles.onboardBottom}><Pressable onPress={onStart} style={styles.primaryButton}><Text style={styles.primaryButtonText}>Comenzar</Text><Text style={styles.buttonArrow}>→</Text></Pressable><Text style={styles.mockNote}>Prototipo visual · onboarding simulado</Text></View>
    </View>
  );
}

function SignInScreen({ onBack, onGoogle }: { onBack: () => void; onGoogle: () => void }) {
  return (
    <>
      <Header onBack={onBack} />
      <View style={styles.onboardContent}>
        <Text style={styles.eyebrow}>TU CUENTA</Text>
        <Text style={styles.title}>Creá tu cuenta para empezar a cobrar.</Text>
        <Text style={styles.onboardSubtitle}>Entrá con Google y nosotros creamos tu cuenta de cobros. No necesitás recordar claves de wallet ni frases de respaldo.</Text>
        <View style={styles.googleCard}>
          <View style={styles.googleMark}><Text style={styles.googleMarkText}>G</Text></View>
          <View style={styles.optionCopy}><Text style={styles.optionTitle}>Continuar con Google</Text><Text style={styles.optionDetail}>Recuperás tu cuenta con tu correo de Google</Text></View>
          <Text style={styles.googleArrow}>→</Text>
        </View>
        <View style={styles.infoRow}><Text style={styles.infoIcon}>✓</Text><Text style={styles.infoText}>No guardamos tu contraseña ni te pedimos frases de respaldo. Tu cuenta se protege con tu acceso de Google.</Text></View>
      </View>
      <View style={styles.bottomActions}>
        <Pressable onPress={onGoogle} style={styles.primaryButton}><Text style={styles.primaryButtonText}>Continuar con Google</Text><Text style={styles.buttonArrow}>→</Text></Pressable>
      </View>
    </>
  );
}

function AccountScreen({ username, password, onUsername, onPassword, onBack, onContinue }: {
  username: string;
  password: string;
  onUsername: (value: string) => void;
  onPassword: (value: string) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const valid = username.trim().length >= 3 && password.length >= 6;
  return (
    <>
      <Header onBack={onBack} />
      <View style={styles.onboardContent}>
        <Text style={styles.eyebrow}>ÚLTIMOS DATOS</Text>
        <Text style={styles.title}>Casi listo. Elegí cómo te llamás.</Text>
        <Text style={styles.onboardSubtitle}>Este nombre lo van a ver tus clientes cuando te paguen.</Text>
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Nombre público</Text>
          <TextInput value={username} onChangeText={onUsername} placeholder="Ej. Café del Parque" placeholderTextColor={colors.inkMuted} style={styles.input} />
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Contraseña de acceso</Text>
          <TextInput value={password} onChangeText={onPassword} placeholder="Mínimo 6 caracteres" placeholderTextColor={colors.inkMuted} secureTextEntry style={styles.input} />
          <Text style={styles.fieldHint}>La usás para entrar a la app. Tu wallet se recupera con Google, no con esta contraseña.</Text>
        </View>
      </View>
      <View style={styles.bottomActions}>
        <Pressable disabled={!valid} onPress={onContinue} style={[styles.primaryButton, !valid && styles.buttonDisabled]}>
          <Text style={styles.primaryButtonText}>Crear mi cuenta</Text><Text style={styles.buttonArrow}>→</Text>
        </Pressable>
      </View>
    </>
  );
}

function WalletReadyScreen({ username, onBack, onContinue }: { username: string; onBack: () => void; onContinue: () => void }) {
  return (
    <>
      <Header onBack={onBack} />
      <View style={styles.onboardContent}>
        <View style={styles.walletShield}><Text style={styles.walletShieldText}>✓</Text></View>
        <Text style={styles.eyebrow}>CUENTA DE COBROS CREADA</Text>
        <Text style={styles.title}>Tu cuenta está lista.</Text>
        <View style={styles.recoveryCard}>
          <Text style={styles.recoveryTitle}>Cómo recuperás tu cuenta</Text>
          <Text style={styles.recoveryText}>Iniciá sesión con el mismo Google y vas a volver a ver tu cuenta y tus cobros.</Text>
          <View style={styles.recoveryDivider} />
          <View style={styles.recoveryRow}><Text style={styles.recoveryIcon}>🔒</Text><Text style={styles.recoveryRowText}>No necesitás frases ni claves de wallet.</Text></View>
          <View style={styles.recoveryRow}><Text style={styles.recoveryIcon}>☁️</Text><Text style={styles.recoveryRowText}>Tus fondos están protegidos y respaldados por el proveedor de tu wallet.</Text></View>
        </View>
        <View style={styles.infoRow}><Text style={styles.infoIcon}>ℹ️</Text><Text style={styles.infoText}>Este es un prototipo visual. La creación real de la wallet se hará con Circle en testnet.</Text></View>
      </View>
      <View style={styles.bottomActions}>
        <Pressable onPress={onContinue} style={styles.primaryButton}><Text style={styles.primaryButtonText}>Continuar</Text><Text style={styles.buttonArrow}>→</Text></Pressable>
      </View>
    </>
  );
}

function StoreScreen({ storeName, category, onStoreName, onCategory, onBack, onContinue }: {
  storeName: string;
  category: string;
  onStoreName: (value: string) => void;
  onCategory: (value: string) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <>
      <Header onBack={onBack} />
      <StepIndicator current={0} />
      <View style={styles.onboardContent}>
        <Text style={styles.eyebrow}>PRIMERO LO BÁSICO</Text>
        <Text style={styles.title}>¿Cómo se llama tu comercio?</Text>
        <Text style={styles.onboardSubtitle}>Lo van a ver tus clientes cuando te paguen.</Text>
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Nombre del comercio</Text>
          <TextInput value={storeName} onChangeText={onStoreName} placeholder="Ej. Café del Parque" placeholderTextColor={colors.inkMuted} style={styles.input} />
        </View>
        <Text style={styles.fieldLabel}>Rubro</Text>
        <View style={styles.chipRow}>
          {categories.map((item) => (
            <Pressable key={item} onPress={() => onCategory(item)} style={[styles.chip, category === item && styles.chipActive]}>
              <Text style={[styles.chipText, category === item && styles.chipTextActive]}>{item}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.bottomActions}>
        <Pressable disabled={!storeName.trim()} onPress={onContinue} style={[styles.primaryButton, !storeName.trim() && styles.buttonDisabled]}>
          <Text style={styles.primaryButtonText}>Continuar</Text><Text style={styles.buttonArrow}>→</Text>
        </Pressable>
      </View>
    </>
  );
}

function PreferenceScreen({ preference, onPreference, onBack, onContinue }: {
  preference: Currency;
  onPreference: (value: Currency) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const options = [
    { value: "ARS" as Currency, title: "Recibir en pesos", detail: "Lo que cobres llega como pesos argentinos.", mark: "$" },
    { value: "USDC" as Currency, title: "Recibir en dólares digitales", detail: "Protegé tus cobros de la inflación.", mark: "U" },
  ];
  return (
    <>
      <Header onBack={onBack} />
      <StepIndicator current={1} />
      <View style={styles.onboardContent}>
        <Text style={styles.eyebrow}>PREFERENCIA DE COBRO</Text>
        <Text style={styles.title}>¿Cómo preferís recibir?</Text>
        <Text style={styles.onboardSubtitle}>Siempre podés cambiarlo después de cada cobro.</Text>
        <View style={styles.optionList}>
          {options.map((option) => {
            const active = preference === option.value;
            return (
              <Pressable key={option.value} onPress={() => onPreference(option.value)} style={({ pressed }) => [styles.optionRow, active && styles.optionRowActive, pressed && styles.optionPressed]}>
                <View style={[styles.optionMark, active && styles.optionMarkActive]}><Text style={[styles.optionMarkText, active && styles.optionMarkTextActive]}>{option.mark}</Text></View>
                <View style={styles.optionCopy}><Text style={styles.optionTitle}>{option.title}</Text><Text style={styles.optionDetail}>{option.detail}</Text></View>
                <View style={[styles.radio, active && styles.radioActive]}>{active && <View style={styles.radioDot} />}</View>
              </Pressable>
            );
          })}
        </View>
      </View>
      <View style={styles.bottomActions}>
        <Pressable onPress={onContinue} style={styles.primaryButton}><Text style={styles.primaryButtonText}>Continuar</Text><Text style={styles.buttonArrow}>→</Text></Pressable>
      </View>
    </>
  );
}

function SummaryScreen({ storeName, category, preference, onBack, onConfirm }: {
  storeName: string;
  category: string;
  preference: Currency;
  onBack: () => void;
  onConfirm: () => void;
}) {
  return (
    <>
      <Header onBack={onBack} />
      <StepIndicator current={2} />
      <View style={styles.onboardContent}>
        <Text style={styles.eyebrow}>REVISÁ TUS DATOS</Text>
        <Text style={styles.title}>Todo listo.</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}><Text style={styles.summaryKey}>Comercio</Text><Text style={styles.summaryValue}>{storeName}</Text></View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}><Text style={styles.summaryKey}>Rubro</Text><Text style={styles.summaryValue}>{category}</Text></View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}><Text style={styles.summaryKey}>Preferencia</Text><Text style={styles.summaryValue}>{preference === "ARS" ? "Pesos (ARS)" : "Dólares digitales (USDC)"}</Text></View>
        </View>
        <View style={styles.infoRow}><Text style={styles.infoIcon}>✓</Text><Text style={styles.infoText}>Vas a poder cobrar con QR y elegir la moneda en cada operación.</Text></View>
      </View>
      <View style={styles.bottomActions}>
        <Pressable onPress={onConfirm} style={styles.primaryButton}><Text style={styles.primaryButtonText}>Crear mi comercio</Text><Text style={styles.buttonArrow}>→</Text></Pressable>
        <Pressable onPress={onBack} style={styles.secondaryButton}><Text style={styles.secondaryButtonText}>Volver</Text></Pressable>
      </View>
    </>
  );
}

function ReadyScreen({ storeName, onGoToCharge }: { storeName: string; onGoToCharge: () => void }) {
  return (
    <View style={styles.onboardCenter}>
      <View style={styles.successMark}><Text style={styles.successCheck}>✓</Text></View>
      <Text style={styles.successEyebrow}>COMERCIO CREADO</Text>
      <Text style={styles.onboardTitle}>{storeName} está listo.</Text>
      <Text style={styles.onboardSubtitle}>Ya podés generar tu primer cobro. Es simulado, así que no te preocupes por errores.</Text>
      <View style={styles.onboardBottom}><Pressable onPress={onGoToCharge} style={styles.primaryButton}><Text style={styles.primaryButtonText}>Hacer mi primer cobro</Text><Text style={styles.buttonArrow}>→</Text></Pressable></View>
    </View>
  );
}

function CurrencyPicker({ currency, onChange }: { currency: Currency; onChange: (currency: Currency) => void }) {
  return (
    <View style={styles.currencyPicker}>
      <Pressable onPress={() => onChange("ARS")} style={[styles.currencyOption, currency === "ARS" && styles.currencyActive]}>
        <Text style={[styles.currencyCode, currency === "ARS" && styles.currencyCodeActive]}>ARS</Text>
        <Text style={styles.currencyLabel}>Pesos</Text>
      </Pressable>
      <Pressable onPress={() => onChange("USDC")} style={[styles.currencyOption, currency === "USDC" && styles.currencyActive]}>
        <Text style={[styles.currencyCode, currency === "USDC" && styles.currencyCodeActive]}>USDC</Text>
        <Text style={styles.currencyLabel}>Dólares digitales</Text>
      </Pressable>
    </View>
  );
}

function ChargeScreen({ amount, currency, onAmount, onCurrency, onContinue }: {
  amount: string;
  currency: Currency;
  onAmount: (value: string) => void;
  onCurrency: (value: Currency) => void;
  onContinue: () => void;
}) {
  const addKey = (key: string) => {
    if (key === "⌫") return onAmount(amount.slice(0, -1));
    if (key === "," && amount.includes(",")) return;
    if (amount.includes(",") && amount.split(",")[1].length >= 2) return;
    if (amount === "0" && key !== ",") return onAmount(key);
    onAmount(`${amount}${key}`);
  };

  return (
    <>
      <Header />
      <View style={styles.intro}>
        <Text style={styles.eyebrow}>NUEVO COBRO</Text>
        <Text style={styles.title}>¿Cuánto vas a cobrar?</Text>
      </View>
      <View style={styles.amountPanel}>
        <Text style={styles.amount}>{currency === "USDC" ? "US$" : "$"} {formatAmount(amount)}</Text>
        <Text style={styles.amountHint}>Ingresá el importe</Text>
      </View>
      <CurrencyPicker currency={currency} onChange={onCurrency} />
      <View style={styles.keypad}>
        {keypad.map((key) => (
          <Pressable key={key} onPress={() => addKey(key)} style={({ pressed }) => [styles.key, pressed && styles.keyPressed]}>
            <Text style={[styles.keyText, key === "⌫" && styles.deleteText]}>{key}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable disabled={!amount || amount === "0"} onPress={onContinue} style={[styles.primaryButton, (!amount || amount === "0") && styles.buttonDisabled]}>
        <Text style={styles.primaryButtonText}>Revisar cobro</Text><Text style={styles.buttonArrow}>→</Text>
      </Pressable>
      <Text style={styles.mockNote}>Prototipo visual · cobros simulados</Text>
    </>
  );
}

function ReviewScreen({ amount, currency, onBack, onConfirm }: { amount: string; currency: Currency; onBack: () => void; onConfirm: () => void }) {
  return (
    <>
      <Header onBack={onBack} />
      <View style={styles.reviewContent}>
        <Text style={styles.eyebrow}>REVISÁ ANTES DE COBRAR</Text>
        <Text style={styles.title}>Todo listo.</Text>
        <View style={styles.reviewAmount}>
          <Text style={styles.reviewLabel}>Vas a cobrar</Text>
          <Text style={styles.reviewValue}>{currency === "USDC" ? "US$" : "$"} {formatAmount(amount)}</Text>
          <Text style={styles.reviewCurrency}>{currency === "ARS" ? "Pesos argentinos" : "Dólares digitales · Arc"}</Text>
        </View>
        <View style={styles.infoRow}><Text style={styles.infoIcon}>QR</Text><Text style={styles.infoText}>El cliente escanea y paga desde su billetera.</Text></View>
        <View style={styles.infoRow}><Text style={styles.infoIcon}>✓</Text><Text style={styles.infoText}>Vas a ver una confirmación cuando el pago se simule.</Text></View>
      </View>
      <View style={styles.bottomActions}>
        <Pressable onPress={onConfirm} style={styles.primaryButton}><Text style={styles.primaryButtonText}>Generar cobro</Text><Text style={styles.buttonArrow}>→</Text></Pressable>
        <Pressable onPress={onBack} style={styles.secondaryButton}><Text style={styles.secondaryButtonText}>Editar importe</Text></Pressable>
      </View>
    </>
  );
}

function QrScreen({ amount, currency, onCancel, onPaid }: { amount: string; currency: Currency; onCancel: () => void; onPaid: () => void }) {
  return (
    <>
      <Header onBack={onCancel} />
      <View style={styles.qrContent}>
        <Text style={styles.eyebrow}>COBRO ACTIVO · MOCK</Text>
        <Text style={styles.title}>Mostrale este código al cliente.</Text>
        <Text style={styles.qrAmount}>{currency === "USDC" ? "US$" : "$"} {formatAmount(amount)}</Text>
        <View style={styles.qrFrame}><View style={styles.qrGrid}>{Array.from({ length: 49 }).map((_, index) => <View key={index} style={[styles.qrCell, (index * 17 + index) % 5 < 2 && styles.qrCellFilled]} />)}</View><View style={styles.qrCenter}><Text style={styles.qrCenterText}>A</Text></View></View>
        <Text style={styles.qrHint}>Esperando el pago · vence en 09:42</Text>
      </View>
      <View style={styles.bottomActions}>
        <Pressable onPress={onPaid} style={styles.mockConfirm}><Text style={styles.mockConfirmText}>Simular pago recibido</Text></Pressable>
        <Pressable onPress={onCancel} style={styles.secondaryButton}><Text style={styles.secondaryButtonText}>Cancelar cobro</Text></Pressable>
      </View>
    </>
  );
}

function SuccessScreen({ amount, currency, onNewCharge }: { amount: string; currency: Currency; onNewCharge: () => void }) {
  return (
    <>
      <Header />
      <View style={styles.successContent}>
        <View style={styles.successMark}><Text style={styles.successCheck}>✓</Text></View>
        <Text style={styles.successEyebrow}>COBRO RECIBIDO</Text>
        <Text style={styles.successTitle}>Listo.</Text>
        <Text style={styles.successAmount}>{currency === "USDC" ? "US$" : "$"} {formatAmount(amount)}</Text>
        <Text style={styles.successTime}>Venta simulada · Ahora</Text>
      </View>
      <View style={styles.bottomActions}><Pressable onPress={onNewCharge} style={styles.primaryButton}><Text style={styles.primaryButtonText}>Nuevo cobro</Text><Text style={styles.buttonArrow}>→</Text></Pressable></View>
    </>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("charge");
  const [onboarding, setOnboarding] = useState<OnboardingScreen>("welcome");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<Currency>("ARS");
  const [storeName, setStoreName] = useState("Café del Parque");
  const [category, setCategory] = useState("Gastronomía");
  const [preference, setPreference] = useState<Currency>("ARS");
  const [username, setUsername] = useState("Café del Parque");
  const [password, setPassword] = useState("");
  const reset = () => { setAmount(""); setCurrency("ARS"); setScreen("charge"); };

  if (onboarding !== "ready") {
    return (
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.container}>
        {onboarding === "welcome" && <WelcomeScreen onStart={() => setOnboarding("signin")} />}
        {onboarding === "signin" && <SignInScreen onBack={() => setOnboarding("welcome")} onGoogle={() => setOnboarding("account")} />}
        {onboarding === "account" && <AccountScreen username={username} password={password} onUsername={setUsername} onPassword={setPassword} onBack={() => setOnboarding("signin")} onContinue={() => setOnboarding("wallet")} />}
        {onboarding === "wallet" && <WalletReadyScreen username={username} onBack={() => setOnboarding("account")} onContinue={() => setOnboarding("store")} />}
        {onboarding === "store" && <StoreScreen storeName={storeName} category={category} onStoreName={setStoreName} onCategory={setCategory} onBack={() => setOnboarding("wallet")} onContinue={() => setOnboarding("preference")} />}
        {onboarding === "preference" && <PreferenceScreen preference={preference} onPreference={setPreference} onBack={() => setOnboarding("store")} onContinue={() => setOnboarding("summary")} />}
        {onboarding === "summary" && <SummaryScreen storeName={storeName} category={category} preference={preference} onBack={() => setOnboarding("preference")} onConfirm={() => setOnboarding("ready")} />}
      </ScrollView>
    );
  }

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.container}>
      {screen === "charge" && <ChargeScreen amount={amount} currency={currency} onAmount={setAmount} onCurrency={setCurrency} onContinue={() => setScreen("review")} />}
      {screen === "review" && <ReviewScreen amount={amount} currency={currency} onBack={() => setScreen("charge")} onConfirm={() => setScreen("qr")} />}
      {screen === "qr" && <QrScreen amount={amount} currency={currency} onCancel={() => setScreen("charge")} onPaid={() => setScreen("success")} />}
      {screen === "success" && <SuccessScreen amount={amount} currency={currency} onNewCharge={reset} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: colors.paper, padding: spacing.page, gap: spacing.section },
  header: { flexDirection: "row", alignItems: "center", minHeight: 52, gap: 12 },
  logoMark: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.ink, alignItems: "center", justifyContent: "center" },
  logoText: { color: colors.sky, fontSize: 20, fontWeight: "800" },
  headerCopy: { flex: 1, gap: 1 },
  brand: { color: colors.ink, fontSize: 16, fontWeight: "800", letterSpacing: -0.3 },
  store: { color: colors.inkMuted, fontSize: 12 },
  online: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 99, backgroundColor: colors.sky },
  onlineDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.success },
  onlineText: { color: colors.turquoiseDark, fontSize: 12, fontWeight: "700" },
  backButton: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.sky, alignItems: "center", justifyContent: "center" },
  backIcon: { color: colors.ink, fontSize: 30, lineHeight: 32, fontWeight: "300" },
  intro: { gap: 8, marginTop: 16 },
  eyebrow: { color: colors.turquoiseDark, fontSize: 11, fontWeight: "800", letterSpacing: 1.5 },
  title: { color: colors.ink, fontSize: 30, lineHeight: 35, fontWeight: "800", letterSpacing: -1 },
  amountPanel: { alignItems: "center", paddingVertical: 18, gap: 5 },
  amount: { color: colors.ink, fontSize: 44, lineHeight: 52, fontWeight: "800", letterSpacing: -1.5, fontVariant: ["tabular-nums"] },
  amountHint: { color: colors.inkMuted, fontSize: 13 },
  currencyPicker: { flexDirection: "row", backgroundColor: colors.skyDeep, borderRadius: 16, padding: 4, gap: 4 },
  currencyOption: { flex: 1, alignItems: "center", justifyContent: "center", minHeight: 50, borderRadius: 12, gap: 2 },
  currencyActive: { backgroundColor: colors.white, boxShadow: "0 2px 6px rgba(16, 42, 67, 0.08)" },
  currencyCode: { color: colors.inkMuted, fontSize: 13, fontWeight: "800" },
  currencyCodeActive: { color: colors.ink },
  currencyLabel: { color: colors.inkMuted, fontSize: 11 },
  keypad: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  key: { width: "31.8%", minHeight: 58, borderRadius: 16, backgroundColor: colors.white, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.line },
  keyPressed: { backgroundColor: colors.skyDeep, transform: [{ scale: 0.97 }] },
  keyText: { color: colors.ink, fontSize: 23, fontWeight: "600", fontVariant: ["tabular-nums"] },
  deleteText: { color: colors.inkMuted, fontSize: 20 },
  primaryButton: { minHeight: 58, borderRadius: 16, backgroundColor: colors.ink, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12 },
  primaryButtonText: { color: colors.white, fontSize: 16, fontWeight: "800" },
  buttonArrow: { color: colors.sky, fontSize: 22 },
  buttonDisabled: { backgroundColor: colors.line },
  mockNote: { color: colors.inkMuted, fontSize: 11, textAlign: "center", marginTop: -14 },
  reviewContent: { flex: 1, gap: 12, paddingTop: 30 },
  reviewAmount: { backgroundColor: colors.sky, borderRadius: 20, padding: 24, marginTop: 20, gap: 5 },
  reviewLabel: { color: colors.inkMuted, fontSize: 13 },
  reviewValue: { color: colors.ink, fontSize: 38, fontWeight: "800", fontVariant: ["tabular-nums"] },
  reviewCurrency: { color: colors.turquoiseDark, fontSize: 13, fontWeight: "700" },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 12 },
  infoIcon: { color: colors.turquoiseDark, fontSize: 12, fontWeight: "800", width: 30, textAlign: "center" },
  infoText: { flex: 1, color: colors.inkMuted, fontSize: 14, lineHeight: 20 },
  bottomActions: { gap: 12, marginTop: "auto" },
  secondaryButton: { minHeight: 48, alignItems: "center", justifyContent: "center" },
  secondaryButtonText: { color: colors.inkMuted, fontSize: 14, fontWeight: "700" },
  qrContent: { alignItems: "center", gap: 12, paddingTop: 18 },
  qrAmount: { color: colors.ink, fontSize: 27, fontWeight: "800", marginBottom: 8, fontVariant: ["tabular-nums"] },
  qrFrame: { width: 238, height: 238, borderRadius: 20, backgroundColor: colors.white, borderWidth: 10, borderColor: colors.white, alignItems: "center", justifyContent: "center", boxShadow: "0 5px 16px rgba(16, 42, 67, 0.12)" },
  qrGrid: { width: 190, height: 190, flexDirection: "row", flexWrap: "wrap" },
  qrCell: { width: "14.28%", height: "14.28%", backgroundColor: colors.white },
  qrCellFilled: { backgroundColor: colors.ink },
  qrCenter: { position: "absolute", width: 42, height: 42, borderRadius: 12, backgroundColor: colors.ink, alignItems: "center", justifyContent: "center", borderWidth: 5, borderColor: colors.white },
  qrCenterText: { color: colors.sky, fontSize: 19, fontWeight: "800" },
  qrHint: { color: colors.inkMuted, fontSize: 13 },
  mockConfirm: { minHeight: 50, borderRadius: 14, backgroundColor: colors.skyDeep, alignItems: "center", justifyContent: "center" },
  mockConfirmText: { color: colors.turquoiseDark, fontSize: 14, fontWeight: "800" },
  successContent: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8, minHeight: 420 },
  successMark: { width: 76, height: 76, borderRadius: 24, backgroundColor: colors.success, alignItems: "center", justifyContent: "center", marginBottom: 18 },
  successCheck: { color: colors.white, fontSize: 42, fontWeight: "400" },
  successEyebrow: { color: colors.success, fontSize: 11, fontWeight: "800", letterSpacing: 1.5 },
  successTitle: { color: colors.ink, fontSize: 42, fontWeight: "800", letterSpacing: -1 },
  successAmount: { color: colors.ink, fontSize: 30, fontWeight: "800", fontVariant: ["tabular-nums"] },
  successTime: { color: colors.inkMuted, fontSize: 13, marginTop: 3 },
  onboardCenter: { flex: 1, justifyContent: "center", gap: 12, minHeight: 520, paddingTop: 30 },
  heroMark: { width: 78, height: 78, borderRadius: 26, backgroundColor: colors.ink, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  heroMarkText: { color: colors.sky, fontSize: 40, fontWeight: "800" },
  onboardEyebrow: { color: colors.turquoiseDark, fontSize: 11, fontWeight: "800", letterSpacing: 1.5, marginTop: 4 },
  onboardTitle: { color: colors.ink, fontSize: 34, lineHeight: 40, fontWeight: "800", letterSpacing: -1.2 },
  onboardSubtitle: { color: colors.inkMuted, fontSize: 15, lineHeight: 22 },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.line },
  featureIcon: { width: 40, height: 40, borderRadius: 13, backgroundColor: colors.skyDeep, alignItems: "center", justifyContent: "center" },
  featureIconText: { color: colors.turquoiseDark, fontSize: 13, fontWeight: "800" },
  featureText: { flex: 1, color: colors.inkMuted, fontSize: 14, lineHeight: 20 },
  onboardBottom: { gap: 12, marginTop: 34 },
  steps: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, marginTop: 8 },
  stepItem: { alignItems: "center", gap: 6 },
  stepDot: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.skyDeep, alignItems: "center", justifyContent: "center" },
  stepDotActive: { backgroundColor: colors.success },
  stepDotNow: { backgroundColor: colors.skyDeep },
  stepDotCheck: { color: colors.white, fontSize: 13, fontWeight: "800" },
  stepDotInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.turquoise },
  stepLabel: { color: colors.inkMuted, fontSize: 11 },
  stepLabelNow: { color: colors.ink, fontWeight: "800" },
  onboardContent: { flex: 1, gap: 12, paddingTop: 24 },
  fieldGroup: { gap: 8, marginTop: 8 },
  fieldLabel: { color: colors.ink, fontSize: 13, fontWeight: "700", marginTop: 8 },
  input: { minHeight: 54, borderRadius: 14, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white, paddingHorizontal: 16, color: colors.ink, fontSize: 16 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: { paddingHorizontal: 16, minHeight: 40, borderRadius: 99, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center" },
  chipActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  chipText: { color: colors.inkMuted, fontSize: 14, fontWeight: "600" },
  chipTextActive: { color: colors.white },
  optionList: { gap: 12, marginTop: 8 },
  optionRow: { flexDirection: "row", alignItems: "center", gap: 14, minHeight: 76, padding: 14, borderRadius: 16, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white },
  optionRowActive: { borderColor: colors.turquoise, backgroundColor: colors.sky },
  optionPressed: { transform: [{ scale: 0.985 }] },
  optionMark: { width: 40, height: 40, borderRadius: 13, backgroundColor: colors.skyDeep, alignItems: "center", justifyContent: "center" },
  optionMarkActive: { backgroundColor: colors.turquoise },
  optionMarkText: { color: colors.turquoiseDark, fontSize: 17, fontWeight: "800" },
  optionMarkTextActive: { color: colors.white },
  optionCopy: { flex: 1, gap: 3 },
  optionTitle: { color: colors.ink, fontSize: 15, fontWeight: "800" },
  optionDetail: { color: colors.inkMuted, fontSize: 12 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: colors.line, alignItems: "center", justifyContent: "center" },
  radioActive: { borderColor: colors.turquoise },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.turquoise },
  summaryCard: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, borderRadius: 18, padding: 18, marginTop: 18 },
  summaryRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10 },
  summaryKey: { color: colors.inkMuted, fontSize: 14 },
  summaryValue: { color: colors.ink, fontSize: 14, fontWeight: "800", flexShrink: 1, textAlign: "right", paddingLeft: 12 },
  divider: { height: 1, backgroundColor: colors.line },
  googleCard: { flexDirection: "row", alignItems: "center", gap: 14, minHeight: 68, padding: 14, borderRadius: 16, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white, marginTop: 14 },
  googleMark: { width: 40, height: 40, borderRadius: 13, backgroundColor: colors.skyDeep, alignItems: "center", justifyContent: "center" },
  googleMarkText: { color: colors.turquoiseDark, fontSize: 19, fontWeight: "800" },
  googleArrow: { color: colors.inkMuted, fontSize: 20 },
  fieldHint: { color: colors.inkMuted, fontSize: 12, lineHeight: 17 },
  walletShield: { width: 66, height: 66, borderRadius: 22, backgroundColor: colors.success, alignItems: "center", justifyContent: "center", marginBottom: 6 },
  walletShieldText: { color: colors.white, fontSize: 34, fontWeight: "400" },
  recoveryCard: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, borderRadius: 18, padding: 18, marginTop: 8, gap: 8 },
  recoveryTitle: { color: colors.ink, fontSize: 16, fontWeight: "800" },
  recoveryText: { color: colors.inkMuted, fontSize: 14, lineHeight: 20 },
  recoveryDivider: { height: 1, backgroundColor: colors.line, marginVertical: 6 },
  recoveryRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  recoveryIcon: { fontSize: 15 },
  recoveryRowText: { flex: 1, color: colors.inkMuted, fontSize: 13, lineHeight: 18 },
});
