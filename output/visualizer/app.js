const canvas = document.getElementById("sceneCanvas");
const ctx = canvas.getContext("2d");

const topicList = document.getElementById("topicList");
const topicSearch = document.getElementById("topicSearch");
const topicGroup = document.getElementById("topicGroup");
const topicTitle = document.getElementById("topicTitle");
const metricStrip = document.getElementById("metricStrip");
const architecture = document.getElementById("architecture");
const observations = document.getElementById("observations");
const formulaBox = document.getElementById("formulaBox");
const defenseNote = document.getElementById("defenseNote");
const playBtn = document.getElementById("playBtn");
const stepBtn = document.getElementById("stepBtn");
const resetBtn = document.getElementById("resetBtn");
const valueToggleBtn = document.getElementById("valueToggleBtn");
const speedRange = document.getElementById("speedRange");
const noiseRange = document.getElementById("noiseRange");
const complexityRange = document.getElementById("complexityRange");

const groupNames = {
  task: "Zadania ML",
  network: "Sieci neuronowe",
  rl: "Uczenie ze wzmocnieniem",
  evolution: "Algorytmy ewolucyjne",
  thesis: "Nasza praca OMR/SVS",
};

const palette = {
  ink: "#17212b",
  muted: "#637181",
  line: "#d8e1e7",
  teal: "#1f7a8c",
  tealSoft: "#e4f3f5",
  amber: "#c17b21",
  amberSoft: "#fff4df",
  violet: "#6d597a",
  violetSoft: "#f0eaf4",
  coral: "#b65a55",
  green: "#2e7d57",
  surface: "#ffffff",
  blue: "#3a6ea5",
};

const topics = [
  {
    id: "classification",
    group: "task",
    title: "Klasyfikacja",
    short: "Granica decyzyjna dzieli przestrzeń cech na klasy.",
    visual: "task",
    architecture: ["Dane x z etykietą y", "Model zwraca prawdopodobieństwa klas", "Softmax albo sigmoid", "Strata: cross-entropy"],
    observations: [
      "Granica przesuwa się tak, aby punkty tej samej klasy znalazły się po właściwej stronie.",
      "Confidence jest odległością od decyzji tylko w uproszczeniu. W praktyce warto sprawdzać kalibrację.",
      "Zbyt kręta granica zwykle oznacza mały bias, ale większe ryzyko overfittingu.",
    ],
    formula: "p(y=k|x)=softmax(z)_k\nCE=-sum_k y_k log(p_k)",
    defense: "Klasyfikacja przewiduje klasę dyskretną. Oceniasz ją przez accuracy, precision, recall, F1, AUC lub macierz pomyłek.",
  },
  {
    id: "regression",
    group: "task",
    title: "Regresja",
    short: "Model przewiduje wartość ciągłą, a nie etykietę klasy.",
    visual: "task",
    architecture: ["Dane x z wartością y", "Model z liniowym wyjściem", "Strata MSE, MAE lub Huber", "Walidacja na danych niewidzianych"],
    observations: [
      "Krzywa dopasowania powinna łapać trend, ale nie każdy szum.",
      "MSE mocniej karze duże błędy, MAE jest odporniejsze na odstające obserwacje.",
      "Regularizacja wygładza predykcję i zmniejsza wariancję modelu.",
    ],
    formula: "MSE = (1/n) sum_i (y_i - y_hat_i)^2\nMAE = (1/n) sum_i |y_i - y_hat_i|",
    defense: "Regresja zwraca liczby ciągłe, np. cenę, F0 albo czas. Oceniasz ją przez MAE, MSE, RMSE i R^2.",
  },
  {
    id: "clustering",
    group: "task",
    title: "Klastrowanie",
    short: "Bez etykiet szukamy grup i reprezentantów danych.",
    visual: "task",
    architecture: ["Same wejścia x", "Metryka podobieństwa", "Centroidy albo prototypy", "Ocena: silhouette, stabilność, interpretacja"],
    observations: [
      "Centroidy przesuwają się do lokalnych średnich grup.",
      "Klastrowanie zależy od skali cech i przyjętej metryki.",
      "Brak etykiet oznacza, że wynik trzeba interpretować domenowo.",
    ],
    formula: "argmin_C sum_k sum_{x in C_k} ||x - mu_k||^2",
    defense: "Klastrowanie jest nienadzorowane: model nie zna poprawnych etykiet, tylko odkrywa strukturę danych.",
  },
  {
    id: "dim-reduction",
    group: "task",
    title: "Redukcja wymiaru",
    short: "Wysokowymiarowe dane rzutujemy na czytelną reprezentację.",
    visual: "task",
    architecture: ["Standaryzacja cech", "PCA/SVD, LDA, UMAP, t-SNE albo autoenkoder", "Kod niskowymiarowy", "Ocena utraty informacji"],
    observations: [
      "PCA zachowuje kierunki największej wariancji, niekoniecznie najlepsze dla klasyfikacji.",
      "t-SNE i UMAP dobrze pokazują lokalne sąsiedztwa, ale globalne odległości bywają mylące.",
      "Autoenkoder uczy nieliniowego kodu przez rekonstrukcję.",
    ],
    formula: "X = U Sigma V^T\nZ = X W_k",
    defense: "Redukcja wymiaru pomaga wizualizować, kompresować i odszumiać dane, ale zawsze traci część informacji.",
  },
  {
    id: "perceptron-mlp",
    group: "network",
    title: "Perceptron i MLP",
    short: "Warstwy dense składają ważone sumy i nieliniowości.",
    visual: "mlp",
    architecture: ["Wejście cech", "Dense + aktywacja", "Dense + aktywacja", "Wyjście: softmax, sigmoid albo liniowe"],
    observations: [
      "Pojedynczy perceptron tworzy liniową granicę decyzyjną.",
      "Warstwy ukryte składają proste decyzje w nieliniową funkcję.",
      "Bez nieliniowości wiele warstw dense nadal byłoby jedną transformacją liniową.",
    ],
    formula: "a^(l)=sigma(W^(l) a^(l-1)+b^(l))",
    defense: "MLP jest uniwersalnym modelem dla danych wektorowych, ale nie wykorzystuje lokalnej struktury obrazów ani sekwencji.",
  },
  {
    id: "backprop",
    group: "network",
    title: "Backpropagation",
    short: "Gradient straty płynie od wyjścia do wcześniejszych warstw.",
    visual: "mlp",
    architecture: ["Forward pass", "Strata L(y, y_hat)", "Reguła łańcuchowa", "Aktualizacja wag optymalizatorem"],
    observations: [
      "Forward liczy predykcję, backward liczy wpływ każdej wagi na stratę.",
      "Gradient jest lokalny w warstwie, ale powstaje przez mnożenie pochodnych z kolejnych warstw.",
      "Modyfikacje: momentum, Adam, normalizacja, dropout, ReLU, early stopping.",
    ],
    formula: "dL/dW_l = delta_l a_(l-1)^T\ndelta_l = (W_(l+1)^T delta_(l+1)) * sigma'(z_l)",
    defense: "Backpropagation nie jest osobną architekturą, tylko algorytmem efektywnego liczenia gradientów w sieciach złożonych z różniczkowalnych operacji.",
  },
  {
    id: "cnn-pooling",
    group: "network",
    title: "CNN i pooling",
    short: "Filtry przesuwają się po obrazie, pooling zagęszcza mapy cech.",
    visual: "cnn",
    architecture: ["Obraz H x W x C", "Konwolucja z dzielonymi wagami", "ReLU", "Max/avg pooling", "Głębsze mapy cech albo decoder"],
    observations: [
      "Ten sam filtr wykrywa podobny lokalny wzorzec w różnych miejscach obrazu.",
      "Pooling zmniejsza rozdzielczość i daje odporność na małe przesunięcia.",
      "Max pooling wybiera najsilniejszą aktywację, avg pooling uśrednia lokalny kontekst.",
    ],
    formula: "Y[i,j,k] = sum_u sum_v sum_c X[i+u,j+v,c] K[u,v,c,k]\nmaxpool = max okna 2x2",
    defense: "CNN jest naturalna dla obrazów, bo używa lokalności i współdzielenia wag. Pooling zmniejsza koszt i polepsza odporność, ale może gubić dokładne położenie.",
  },
  {
    id: "rnn-lstm-gru",
    group: "network",
    title: "RNN, LSTM i GRU",
    short: "Stan ukryty przenosi informację przez kolejne kroki sekwencji.",
    visual: "sequence",
    architecture: ["Wejścia x_t", "Stan h_t", "Bramki LSTM/GRU", "Wyjście y_t albo y_T", "BPTT przez czas"],
    observations: [
      "RNN używa tych samych wag dla każdego kroku czasu.",
      "LSTM i GRU dodają bramki, które kontrolują zapamiętywanie i zapominanie.",
      "Uczenie jest trudniejsze przez zanikające lub eksplodujące gradienty.",
    ],
    formula: "h_t = f(W_x x_t + W_h h_(t-1) + b)",
    defense: "RNN modeluje sekwencje i szeregi czasowe, ale dla długich zależności często przegrywa z transformerami lub wymaga bramek.",
  },
  {
    id: "transformer",
    group: "network",
    title: "Transformer i attention",
    short: "Każdy token może ważyć informacje z innych tokenów.",
    visual: "transformer",
    architecture: ["Embedding + pozycja", "Q, K, V", "Scaled dot-product attention", "Feed-forward", "Residual + normalizacja"],
    observations: [
      "Attention pokazuje, z których tokenów korzysta bieżąca reprezentacja.",
      "Transformery przetwarzają sekwencję bardziej równolegle niż RNN.",
      "Dekoder autoregresyjny generuje token po tokenie, używając poprzednich wyjść.",
    ],
    formula: "Attention(Q,K,V)=softmax(QK^T / sqrt(d_k)) V",
    defense: "Transformer opiera się na attention, czyli ważeniu relacji między elementami sekwencji. Jest podstawą nowoczesnego NLP, OCR i wielu modeli multimodalnych.",
  },
  {
    id: "autoencoder",
    group: "network",
    title: "Autoenkoder",
    short: "Encoder ściska wejście, decoder próbuje je odtworzyć.",
    visual: "autoencoder",
    architecture: ["Wejście x", "Encoder", "Bottleneck z", "Decoder", "Rekonstrukcja x_hat"],
    observations: [
      "Wąskie gardło wymusza kompresję istotnych cech.",
      "Jeśli model ma zbyt dużą pojemność, może nauczyć się trywialnej kopii.",
      "Wersje odszumiające uczą stabilniejszych reprezentacji.",
    ],
    formula: "z = f_enc(x)\nx_hat = f_dec(z)\nL = ||x - x_hat||^2",
    defense: "Autoenkoder jest nienadzorowanym sposobem uczenia reprezentacji przez rekonstrukcję. Nadaje się do kompresji, odszumiania i detekcji anomalii.",
  },
  {
    id: "hopfield",
    group: "network",
    title: "Sieć Hopfielda",
    short: "Pamięć skojarzeniowa odtwarza wzorce przez spadek energii.",
    visual: "hopfield",
    architecture: ["Neurony bipolarne", "Pełne symetryczne połączenia", "Brak połączeń własnych", "Reguła Hebba", "Asynchroniczne aktualizacje"],
    observations: [
      "Wzorce zapisane w wagach stają się atraktorami dynamiki.",
      "Zaszumiony wzorzec schodzi do najbliższego minimum energii.",
      "Ograniczenia to pojemność, minima fałszywe i korelacje wzorców.",
    ],
    formula: "w_ij = (1/N) sum_p x_i^p x_j^p\nE = -1/2 sum_i sum_j w_ij s_i s_j",
    defense: "Hopfield adresuje pamięć zawartością: podajesz fragment lub zaszumiony wzorzec, a sieć iteracyjnie dochodzi do atraktora.",
  },
  {
    id: "som",
    group: "network",
    title: "Kohonen SOM, WTA i WTM",
    short: "Mapa prototypów porządkuje dane topologicznie.",
    visual: "som",
    architecture: ["Siatka neuronów", "Wektor wag w przestrzeni danych", "Best Matching Unit", "Aktualizacja zwycięzcy i sąsiadów", "Malejący promień"],
    observations: [
      "WTA aktualizuje zwycięzcę, WTM także jego sąsiadów.",
      "Duży promień na początku porządkuje mapę globalnie.",
      "Mały promień pod koniec dopracowuje lokalne prototypy.",
    ],
    formula: "c = argmin_i ||x - w_i||\nw_i <- w_i + alpha h_ci (x - w_i)",
    defense: "SOM jest nienadzorowaną siecią konkurencyjną do klastrowania i wizualizacji danych wysokowymiarowych.",
  },
  {
    id: "art",
    group: "network",
    title: "ART / Grossberg",
    short: "Vigilance decyduje, czy aktualizować kategorię, czy stworzyć nową.",
    visual: "art",
    architecture: ["Warstwa wejściowa", "Kategorie", "Wagi bottom-up", "Wagi top-down", "Test czujności", "Rezonans albo reset"],
    observations: [
      "Niska czujność łączy podobne wzorce w większe kategorie.",
      "Wysoka czujność tworzy więcej, bardziej szczegółowych kategorii.",
      "ART chroni stare kategorie przed katastroficznym nadpisaniem.",
    ],
    formula: "match = |x and w_j| / |x|\nif match >= vigilance: resonance\nelse: reset category",
    defense: "ART odpowiada na dylemat stabilność-plastyczność: system uczy się nowych kategorii, ale nie niszczy łatwo starych.",
  },
  {
    id: "boltzmann",
    group: "network",
    title: "Maszyna Boltzmanna",
    short: "Stochastyczna sieć szuka stanów o niskiej energii.",
    visual: "boltzmann",
    architecture: ["Warstwa widoczna", "Warstwa ukryta", "Wagi dwudzielne RBM", "p(h|v), p(v|h)", "Gibbs sampling", "Energia próbki"],
    observations: [
      "Temperatura kontroluje losowość przejść między stanami.",
      "Niższa energia oznacza bardziej prawdopodobny stan.",
      "RBM upraszcza pełną maszynę Boltzmanna przez strukturę dwudzielną.",
    ],
    formula: "P(s) = exp(-E(s)/T) / Z\nRBM: E(v,h)=-b^T v-c^T h-v^TWh",
    defense: "Maszyny Boltzmanna są probabilistycznymi modelami energetycznymi. W wizualizacji używam RBM, bo łatwiej pokazać realne p(h|v), p(v|h) i Gibbs sampling.",
  },
  {
    id: "reservoir",
    group: "network",
    title: "Reservoir computing",
    short: "Losowy rezerwuar przekształca sekwencję, uczony jest głównie readout.",
    visual: "reservoir",
    architecture: ["Wejście czasowe", "Duży losowy rezerwuar", "Echo state", "Uczony readout liniowy"],
    observations: [
      "Wewnętrzne połączenia są zwykle ustalone losowo.",
      "Dynamika rezerwuaru tworzy bogate cechy czasowe.",
      "Uczenie readoutu jest szybkie, ale zależy od jakości rezerwuaru i skali wag.",
      "Na wykresie fioletowy odczyt próbuje dogonić opóźniony sygnał docelowy.",
    ],
    formula: "h_t = tanh(W_in x_t + W_res h_(t-1))\ny_t = W_out h_t",
    defense: "Reservoir computing przenosi ciężar modelowania na dynamikę losowego układu, a trenuje prosty odczyt.",
  },
  {
    id: "spiking",
    group: "network",
    title: "Spiking Neural Network",
    short: "Informacja płynie jako impulsy, a nie ciągłe aktywacje.",
    visual: "spiking",
    architecture: ["Sygnały wejściowe jako spike train", "Potencjał błonowy", "Próg odpalenia", "Reset", "Kodowanie czasem lub częstością"],
    observations: [
      "Neuron zbiera potencjał, dopóki nie przekroczy progu.",
      "Po spiku potencjał jest resetowany lub wygaszany.",
      "SNN są bliższe biologii, ale trudniejsze do trenowania klasycznym backprop.",
    ],
    formula: "V_t = lambda V_(t-1) + I_t\nspike = 1 if V_t >= theta",
    defense: "SNN modeluje komunikację impulsową. Warto podkreślić próg, czas spików i inną dynamikę niż w MLP.",
  },
  {
    id: "anfis-elm",
    group: "network",
    title: "ANFIS i ELM",
    short: "Dwie szybkie intuicje: reguły fuzzy oraz losowa warstwa ukryta.",
    visual: "fuzzy",
    architecture: ["ANFIS: membership functions", "Reguły if-then", "Agregacja", "ELM: losowe neurony ukryte", "Uczone wagi wyjściowe"],
    observations: [
      "ANFIS łączy interpretowalne reguły rozmyte z uczeniem parametrów.",
      "ELM losuje hidden layer i szybko rozwiązuje liniowy readout.",
      "Oba podejścia są przydatne, gdy chcesz szybkie uczenie lub interpretowalną strukturę.",
    ],
    formula: "ANFIS: y = sum_i w_i f_i(x) / sum_i w_i\nELM: beta = H^+ Y",
    defense: "ANFIS to neuro-fuzzy, a ELM to feedforward z losową warstwą ukrytą i uczonym wyjściem.",
  },
  {
    id: "neocognitron",
    group: "network",
    title: "Neocognitron",
    short: "Historyczny przodek CNN: warstwy S/C budują cechy odporne na przesunięcia.",
    visual: "neocognitron",
    architecture: ["Warstwy S: detekcja cech", "Warstwy C: lokalne uogólnianie", "Hierarchia cech", "Od prostych krawędzi do kształtów"],
    observations: [
      "Warstwy S przypominają konwolucyjne detektory cech.",
      "Warstwy C zwiększają tolerancję na lokalne przesunięcia.",
      "Idea hierarchii cech wraca w nowoczesnych CNN.",
    ],
    formula: "S-layer: lokalny detektor\nC-layer: lokalna agregacja / tolerancja",
    defense: "Neocognitron warto kojarzyć jako biologicznie inspirowany prekursor CNN z warstwami wykrywania i agregacji cech.",
  },
  {
    id: "bandit",
    group: "rl",
    title: "Wieloręki bandyta",
    short: "Agent balansuje eksplorację i eksploatację bez stanu środowiska.",
    visual: "bandit",
    architecture: ["Akcje ramion", "Nagroda po akcji", "Szacunki Q(a)", "Epsilon-greedy", "Aktualizacja przyrostowa"],
    observations: [
      "Eksploracja sprawdza niepewne akcje, eksploatacja bierze najlepszą znaną.",
      "W niestacjonarnym problemie stały krok alfa szybciej zapomina stare dane.",
      "To najprostszy model konfliktu: wiedza teraz kontra lepsza wiedza później.",
    ],
    formula: "Q_(n+1)(a) = Q_n(a) + alpha [R_n - Q_n(a)]",
    defense: "Bandyta nie ma przejść między stanami. Uczy się wartości akcji na podstawie nagród.",
  },
  {
    id: "mdp-bellman",
    group: "rl",
    title: "MDP i Bellman",
    short: "Stan, akcja, przejście, nagroda i dyskonto opisują decyzje w czasie.",
    visual: "rl",
    architecture: ["Stany S", "Akcje A", "Przejścia p(s',r|s,a)", "Polityka pi", "Funkcje V i Q"],
    observations: [
      "Własność Markowa mówi, że przyszłość zależy od obecnego stanu i akcji.",
      "Równanie Bellmana wiąże wartość stanu z nagrodą i wartością następnego stanu.",
      "Policy iteration i value iteration wymagają modelu przejść.",
    ],
    formula: "V^pi(s)=sum_a pi(a|s) sum_{s',r} p(s',r|s,a)[r + gamma V^pi(s')]",
    defense: "MDP jest formalnym modelem RL. Bez niego trudno precyzyjnie mówić o polityce, wartości i optymalności.",
  },
  {
    id: "td-prediction",
    group: "rl",
    title: "TD(0): predykcja wartości",
    short: "Wartość stanu uczy się po każdym przejściu przez bootstrapping.",
    visual: "rl",
    architecture: ["Stan s", "Akcja z polityki", "Nagroda r", "Następny stan s'", "TD target", "Aktualizacja V(s)"],
    observations: [
      "TD uczy się po każdym kroku, nie czeka na koniec epizodu jak Monte Carlo.",
      "Target zawiera własne oszacowanie V(s'), więc metoda bootstrapuje.",
      "To jest predykcja wartości dla danej polityki, jeszcze nie pełna kontrola optymalnej akcji.",
    ],
    formula: "V(s) <- V(s) + alpha [r + gamma V(s') - V(s)]",
    defense: "TD łączy Monte Carlo i programowanie dynamiczne: uczy się z próbek, ale aktualizuje przez bootstrapping.",
  },
  {
    id: "sarsa",
    group: "rl",
    title: "SARSA: on-policy control",
    short: "Aktualizacja używa faktycznej następnej akcji wybranej przez politykę.",
    visual: "rl",
    architecture: ["s", "a", "r", "s'", "a' z tej samej polityki", "Q(s,a) update"],
    observations: [
      "Nazwa SARSA pochodzi od ciągu: state, action, reward, state, action.",
      "Jest on-policy: uczy wartości akcji, które faktycznie wykonuje eksplorująca polityka.",
      "Przy epsilon-greedy SARSA bywa ostrożniejsza przy ryzykownych polach, bo uwzględnia eksplorację.",
    ],
    formula: "Q(s,a) <- Q(s,a) + alpha [r + gamma Q(s',a') - Q(s,a)]",
    defense: "SARSA wyjaśnia, jak agent uczy się polityki, którą sam wykonuje. Następna akcja a' nie jest maksimum z tabeli, tylko realnie wybranym ruchem.",
  },
  {
    id: "q-learning",
    group: "rl",
    title: "Q-learning: off-policy control",
    short: "Aktualizacja patrzy na najlepszą następną akcję, nawet jeśli agent eksplorował.",
    visual: "rl",
    architecture: ["s", "a", "r", "s'", "max_a Q(s',a)", "Q(s,a) update"],
    observations: [
      "Q-learning jest off-policy: zachowanie może eksplorować, ale target zakłada najlepszą akcję.",
      "Decyzja w symulacji jest epsilon-greedy: czasem losowa, zwykle z największym Q.",
      "Różnica względem SARSA siedzi dokładnie w targetcie po przejściu do s'.",
    ],
    formula: "Q(s,a) <- Q(s,a) + alpha [r + gamma max_a' Q(s',a') - Q(s,a)]",
    defense: "Q-learning uczy optymalnej funkcji akcji niezależnie od tego, że agent w trakcie nauki czasem eksploruje.",
  },
  {
    id: "dqn-policy",
    group: "rl",
    title: "Deep RL: DQN i gradient polityki",
    short: "Sieć aproksymuje Q albo bezpośrednio politykę.",
    visual: "deep-rl",
    architecture: ["Stan jako wektor/obraz", "Sieć Q albo policy network", "Replay buffer", "Target network", "Gradient polityki"],
    observations: [
      "DQN zastępuje tabelę Q siecią neuronową.",
      "Replay buffer zmniejsza korelację próbek, target network stabilizuje cel.",
      "Gradient polityki optymalizuje prawdopodobieństwa akcji zamiast wartości Q.",
    ],
    formula: "DQN target = r + gamma max_a Q_target(s',a)\npolicy gradient: grad J = E[grad log pi(a|s) G]",
    defense: "Deep RL jest potrzebny, gdy stanów jest za dużo na tabelę. Cena to niestabilność i większe wymagania danych.",
  },
  {
    id: "evolution",
    group: "evolution",
    title: "Algorytm ewolucyjny",
    short: "Populacja rozwiązań przechodzi selekcję, krzyżowanie i mutację.",
    visual: "evolution",
    architecture: ["Reprezentacja osobnika", "Funkcja fitness", "Selekcja", "Krzyżowanie", "Mutacja", "Elityzm"],
    observations: [
      "Selekcja przesuwa populację w stronę lepszych regionów.",
      "Mutacja utrzymuje eksplorację i chroni przed przedwczesną zbieżnością.",
      "Reprezentacja decyduje, czy operatory tworzą sensowne rozwiązania.",
    ],
    formula: "P_t -> selection -> crossover -> mutation -> P_(t+1)",
    defense: "Algorytm ewolucyjny jest populacyjną metaheurystyką. Nie potrzebuje gradientu, ale zwykle wymaga wielu ewaluacji fitness.",
  },
  {
    id: "neuroevolution",
    group: "evolution",
    title: "Neuroewolucja i NEAT",
    short: "Ewolucja może projektować wagi, topologię i hiperparametry sieci.",
    visual: "neuroevolution",
    architecture: ["Genom sieci", "Mutacja wag", "Dodanie połączenia", "Dodanie neuronu", "Numery innowacji", "Specjacja"],
    observations: [
      "NEAT zaczyna od prostych topologii i stopniowo je rozbudowuje.",
      "Numery innowacji dopasowują geny podczas krzyżowania różnych topologii.",
      "Specjacja chroni nowe struktury, zanim zdążą zostać dopracowane.",
    ],
    formula: "fitness(network) -> selection + structural mutation + crossover",
    defense: "Neuroewolucja uzupełnia backprop: ewolucja dobrze przeszukuje decyzje strukturalne, a gradient szybko dostraja wagi.",
  },
  {
    id: "pipeline",
    group: "thesis",
    title: "Pipeline OMR - OCR - SVS",
    short: "Od obrazu nut do struktury muzycznej i syntezy śpiewu.",
    visual: "pipeline",
    architecture: ["Obraz partytury", "OMR: Faster R-CNN dla symboli", "OCR tekstu wokalnego", "Score IR / MIDI", "Model akustyczny SVS", "Wokoder"],
    observations: [
      "Błędy wczesnego modułu propagują się do kolejnych etapów.",
      "Confidence i progi są ważne, bo pomagają sterować fallbackami.",
      "Metryka modułu, np. mAP, nie zawsze odpowiada jakości muzycznej końca pipeline'u.",
    ],
    formula: "image -> OMR detections + OCR text -> Score IR -> acoustic features -> waveform",
    defense: "W pracy najważniejsza jest integracja: OMR dostarcza symbole i pozycje muzyczne, OCR tekst, a SVS zamienia strukturę na śpiew lub audio.",
  },
  {
    id: "unet-segmentation",
    group: "thesis",
    title: "Lokalizacja tekstu: U-Net, U-Net++, DeepLabV3+",
    short: "Segmentacja tworzy maskę pikseli dla tekstu lub obiektów.",
    visual: "segmentation",
    architecture: ["Encoder", "Bottleneck", "Decoder", "Skip connections", "Attention gates", "U-Net++ dense skip paths", "DeepLabV3+ ASPP", "Maska binarna"],
    observations: [
      "Skip connections przywracają szczegóły przestrzenne utracone w encoderze.",
      "Attention gate tłumi tło i wzmacnia ważne cechy w skipie.",
      "DeepLabV3+ używa kontekstu wieloskalowego przez ASPP.",
      "Dice Loss pomaga przy dużej przewadze tła nad tekstem.",
    ],
    formula: "Dice = 2|P cap G| / (|P| + |G|)\nBCE + Dice stabilizuje uczenie maski",
    defense: "W pracy lokalizacja tekstu jest traktowana jako segmentacja binarna pikseli. U-Net, Attention U-Net, U-Net++ i DeepLabV3+ są wariantami encoder-decoder do tej intuicji.",
  },
  {
    id: "detection",
    group: "thesis",
    title: "OMR: Faster R-CNN + własny CNN backbone",
    short: "Detektor znajduje klasy i ramki symboli na partyturze.",
    visual: "detection",
    architecture: ["Własny CNN backbone [96,192,384,512]", "Stride 8 albo 16", "Mapa cech", "RPN i małe anchors", "RoIAlign", "136 klas", "Bounding-box regression"],
    observations: [
      "Objectness mówi, czy anchor zawiera obiekt.",
      "Regresja boxa poprawia położenie względem anchora.",
      "Zmniejszenie stride'u zagęszcza mapę cech i pomaga małym symbolom, ale zmienia koszt oraz kompromis precision-recall.",
      "AP50 jest łagodniejsze, AP75 mocniej karze niedokładną lokalizację.",
    ],
    formula: "loss = L_cls + L_box\nIoU = area(intersection) / area(union)",
    defense: "W pracy OMR jest detekcją obiektów muzycznych na Faster R-CNN trenowanym od zera z własnym CNN backbone'em. Sama detekcja obiektu to za mało: położenie wpływa na wysokość, rytm i Score IR.",
  },
  {
    id: "ocr-transformer",
    group: "thesis",
    title: "OCR: CRNN-CTC, Transformer, TrOCR, PP-OCR",
    short: "Obraz tekstu zamienia się na sekwencję znaków lub tokenów.",
    visual: "ocr",
    architecture: ["Crop tekstu z lokalizatora", "CNN encoder", "CRNN z RNN/LSTM", "CTC bez ręcznego alignmentu", "Transformer/TrOCR decoder", "PP-OCR jako silnik praktyczny"],
    observations: [
      "CRNN-CTC zakłada monotoniczne wyrównanie znaków.",
      "Transformer OCR może korzystać z kontekstu językowego w dekoderze.",
      "Własne modele OCR w pracy porównują rodzinę CRNN z mocniejszym enkoderem albo komponentem transformatorowym.",
      "W tekście wokalnym myślniki mogą zmieniać dopasowanie sylab do nut.",
    ],
    formula: "CTC marginalizuje alignments\nTransformer: p(y_t | y_<t, image)",
    defense: "OCR w pipeline'ie muzycznym nie jest tylko odczytem tekstu. Błędy znaków mogą popsuć synchronizację słów i melodii.",
  },
  {
    id: "svs",
    group: "thesis",
    title: "SVS: wejście muzyczno-fonemowe",
    short: "Score IR dostarcza fonemy, wysokości, czasy i kontekst wykonawczy.",
    visual: "svs",
    architecture: ["Score IR", "Fonemy ARPAbet", "Czasy start/koniec", "Score F0", "Głos i styl", "Mel/F0/energy", "Waveform"],
    observations: [
      "Mel-spektrogram przechowuje energię w pasmach, ale nie pełną fazę.",
      "Błąd F0 w centach lepiej odpowiada percepcji muzycznej niż Hz.",
      "MOS jest potrzebny, bo metryki obiektywne nie mierzą całej naturalności śpiewu.",
    ],
    formula: "cents = 1200 log2(f_pred / f_ref)\nmel -> vocoder -> waveform",
    defense: "SVS wymaga rozdzielenia jakości wysokości, rytmu, barwy i naturalności. Sam niski błąd F0 nie dowodzi dobrego śpiewu.",
  },
  {
    id: "svs-acoustic",
    group: "thesis",
    title: "Model akustyczny: Transformer + Conformer",
    short: "Autorski SVS przewiduje mel, F0 i energię z fonemów oraz partytury.",
    visual: "svs-acoustic",
    architecture: ["Embedding fonemu, głosu i stylu", "Event encoder Transformer", "Length regulator", "Frame decoder Conformer", "Predykcja mel-spektrogramu", "Pomocnicze F0, energia, duration"],
    observations: [
      "Starszy wariant łączył eventowy Transformer z ramkowym dekoderem BiLSTM.",
      "Nowszy wariant GTSinger zachowuje Transformer encoder, ale używa Conformera po regulatorze długości.",
      "Score-relative F0 ułatwia kontrolę zgodności z linią melodyczną partytury.",
    ],
    formula: "events -> Transformer -> length regulator -> Conformer frames\noutputs: mel, F0, energy, duration",
    defense: "W pracy to serce SVS: model akustyczny zamienia reprezentację symboliczną i fonemową na cechy akustyczne, zanim wokoder zrobi falę audio.",
  },
  {
    id: "svs-vocoder",
    group: "thesis",
    title: "Wokoder: HiFi-GAN-like source-filter",
    short: "Generator zamienia mel-spektrogram na waveform i ma reagować na F0.",
    visual: "vocoder",
    architecture: ["Mel-spektrogram 80 pasm", "Projekcje F0 i energii", "Transposed convolutions", "Bloki rezydualne", "Harmonic source-filter", "Dyskryminatory GAN"],
    observations: [
      "Wokoder jest osobnym modelem, więc błąd może leżeć w melu albo w rekonstrukcji fali.",
      "Source-filter dodaje harmoniczne źródło zależne od F0 na kolejnych skalach czasu.",
      "Pitch-shift sensitivity karze sytuację, w której przesunięcie F0 prawie nie zmienia audio.",
    ],
    formula: "mel + F0 + energy -> generator -> waveform\nGAN loss + mel loss + feature matching + pitch sensitivity",
    defense: "W pracy wokoder jest inspirowany HiFi-GAN i dostrajany tak, aby lepiej reagował na F0 oraz mel-spektrogramy generowane przez model akustyczny.",
  },
];

const renderers = {
  task: renderTask,
  mlp: renderMlp,
  cnn: renderCnn,
  sequence: renderSequence,
  transformer: renderTransformer,
  autoencoder: renderAutoencoder,
  hopfield: renderHopfield,
  som: renderSom,
  art: renderArt,
  boltzmann: renderBoltzmann,
  reservoir: renderReservoir,
  spiking: renderSpiking,
  fuzzy: renderFuzzyElm,
  neocognitron: renderNeocognitron,
  bandit: renderBandit,
  rl: renderRl,
  "deep-rl": renderDeepRl,
  evolution: renderEvolution,
  neuroevolution: renderNeuroevolution,
  pipeline: renderPipeline,
  segmentation: renderSegmentation,
  detection: renderDetection,
  ocr: renderOcr,
  svs: renderSvs,
  "svs-acoustic": renderSvsAcoustic,
  vocoder: renderVocoder,
};

const state = {
  activeId: "cnn-pooling",
  category: "all",
  query: "",
  playing: false,
  time: 0,
  step: 0,
  tick: 0,
  lastTs: 0,
  speed: Number(speedRange.value),
  noise: Number(noiseRange.value),
  complexity: Number(complexityRange.value),
  showValues: false,
  local: {},
};

const data = createData();

function mulberry32(seed) {
  return function random() {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createData() {
  const rand = mulberry32(12);
  const clusters = [
    { x: 0.28, y: 0.34, c: "#1f7a8c" },
    { x: 0.67, y: 0.32, c: "#c17b21" },
    { x: 0.52, y: 0.68, c: "#6d597a" },
  ];
  const points = [];
  clusters.forEach((cluster, label) => {
    for (let i = 0; i < 42; i += 1) {
      points.push({
        x: clamp(cluster.x + (rand() - 0.5) * 0.22, 0.06, 0.94),
        y: clamp(cluster.y + (rand() - 0.5) * 0.20, 0.06, 0.94),
        label,
        color: cluster.c,
      });
    }
  });
  const regression = Array.from({ length: 42 }, (_, i) => {
    const x = i / 41;
    const y = 0.58 - 0.32 * Math.sin(x * Math.PI * 1.35) + (rand() - 0.5) * 0.12;
    return { x, y: clamp(y, 0.08, 0.92) };
  });
  const highDim = points.map((p, i) => ({
    x: p.x,
    y: p.y,
    z: 0.25 + 0.5 * ((i % 7) / 6),
    label: p.label,
    color: p.color,
  }));
  return { points, regression, highDim, clusters };
}

function createLocalState(topicId) {
  const rand = mulberry32(hashCode(topicId) + 99);
  if (topicId === "dim-reduction") {
    const model = buildPcaModel(data.highDim);
    return {
      ...model,
      v1: normalizeVec([0.42, 0.75, 0.51]),
      v2: normalizeVec([-0.64, 0.24, 0.73]),
      iteration: 0,
    };
  }
  if (topicId === "rnn-lstm-gru") {
    return {
      tokens: ["nu", "ta", "śpie", "wu", "pauza"],
      inputs: [
        [1, 0, 0],
        [0.7, 0.7, 0.1],
        [0.1, 1, 0.8],
        [0.2, 0.5, 1],
        [0, 0, 0.4],
      ],
      wx: [
        [0.9, -0.3, 0.45],
        [-0.2, 0.82, 0.38],
        [0.42, 0.28, -0.72],
      ],
      wh: [
        [0.48, -0.28, 0.12],
        [0.24, 0.52, -0.34],
        [-0.18, 0.31, 0.44],
      ],
      b: [0.06, -0.04, 0.02],
      h: [0, 0, 0],
      index: 0,
      history: [],
      gates: { input: 0.5, forget: 0.5, output: 0.5 },
    };
  }
  if (topicId === "hopfield") {
    const patterns = hopfieldPatterns();
    const targetIndex = 0;
    const target = patterns[targetIndex].bits;
    const weights = makeHopfieldWeights(patterns.map((pattern) => pattern.bits));
    const current = target.map((value) => (rand() < 0.28 ? -value : value));
    const order = Array.from({ length: target.length }, (_, index) => index).sort(() => rand() - 0.5);
    return {
      patterns,
      targetIndex,
      target,
      weights,
      current,
      order,
      cursor: 0,
      lastNeuron: -1,
      lastField: 0,
      updates: [],
      energy: [hopfieldEnergy(current, weights)],
    };
  }
  if (topicId === "som") {
    const nodes = [];
    for (let y = 0; y < 8; y += 1) {
      for (let x = 0; x < 8; x += 1) {
        nodes.push({ gx: x, gy: y, x: 0.15 + rand() * 0.7, y: 0.15 + rand() * 0.7 });
      }
    }
    return { nodes, sampleIndex: 0, lastSample: data.points[0], lastBest: nodes[0], lastRadius: 3.4 };
  }
  if (topicId === "art") {
    return {
      inputIndex: 0,
      prototypes: [
        [1, 1, 0, 0, 1, 0, 0],
        [0, 0, 1, 1, 0, 1, 0],
      ],
      inputs: [
        [1, 1, 0, 0, 1, 0, 0],
        [1, 1, 0, 0, 0, 0, 1],
        [0, 0, 1, 1, 0, 1, 0],
        [1, 0, 1, 0, 1, 0, 1],
      ],
    };
  }
  if (topicId === "bandit") {
    return {
      trueRewards: [0.35, 0.52, 0.68, 0.47, 0.78],
      estimates: [0.5, 0.5, 0.5, 0.5, 0.5],
      counts: [0, 0, 0, 0, 0],
      lastArm: 0,
      totalReward: 0,
    };
  }
  if (topicId === "boltzmann") {
    return {
      visible: [1, 0, 1, 0, 1, 0],
      hidden: [0, 1, 0, 1],
      vBias: [0.15, -0.05, 0.18, -0.12, 0.08, 0.02],
      hBias: [0.06, -0.02, 0.12, -0.08],
      weights: [
        [0.8, -0.4, 0.35, -0.15],
        [0.62, -0.32, 0.12, 0.2],
        [-0.22, 0.7, -0.25, 0.4],
        [-0.42, 0.55, 0.35, -0.12],
        [0.34, -0.18, 0.72, 0.25],
        [-0.16, 0.22, -0.38, 0.65],
      ],
      phase: "h|v",
      probs: [],
      energy: [],
    };
  }
  if (topicId === "reservoir") {
    const count = 18;
    const wres = Array.from({ length: count }, (_, i) =>
      Array.from({ length: count }, (_, j) => ((i * 17 + j * 11) % 7 === 0 ? (rand() - 0.5) * 0.55 : 0))
    );
    return {
      nodes: circularNodes(0, 0, 1, count),
      win: Array.from({ length: count }, () => rand() * 1.8 - 0.9),
      wres,
      wout: Array.from({ length: count }, () => rand() * 0.08 - 0.04),
      h: Array.from({ length: count }, () => 0),
      t: 0,
      input: 0,
      target: 0,
      output: 0,
      error: 0,
      history: [],
    };
  }
  if (topicId === "evolution" || topicId === "neuroevolution") {
    return {
      generation: 0,
      population: Array.from({ length: 52 }, () => ({ x: rand() * 2 - 1, y: rand() * 2 - 1, mutation: rand() })),
      bestPath: [],
    };
  }
  if (["mdp-bellman", "td-prediction", "sarsa", "q-learning"].includes(topicId)) {
    return createGridWorldState(topicId, rand);
  }
  if (topicId === "dqn-policy") {
    return {
      dqnQ: [0.18, 0.42, 0.24, 0.36],
      targetQ: [0.26, 0.52, 0.31, 0.44],
      policy: [0.24, 0.26, 0.2, 0.3],
      replay: [
        { s: [0, 4], a: 1, r: -0.03, sp: [0, 3] },
        { s: [1, 2], a: 0, r: -0.03, sp: [2, 2] },
        { s: [3, 1], a: 1, r: 1, sp: [4, 0] },
      ],
      replayIndex: 0,
      tdError: 0,
      sampledAction: 0,
      advantage: 0,
    };
  }
  return {};
}

function hashCode(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function formatPercent(value) {
  return `${Math.round(value * 100)}%`;
}

function sigmoid(value) {
  return 1 / (1 + Math.exp(-value));
}

function softmax(values, temperature = 1) {
  const scaled = values.map((value) => value / temperature);
  const max = Math.max(...scaled);
  const exps = scaled.map((value) => Math.exp(value - max));
  const sum = exps.reduce((a, b) => a + b, 0) || 1;
  return exps.map((value) => value / sum);
}

function activeTopic() {
  return topics.find((topic) => topic.id === state.activeId) || topics[0];
}

function filteredTopics() {
  const query = state.query.trim().toLowerCase();
  return topics.filter((topic) => {
    const matchesCategory = state.category === "all" || topic.group === state.category;
    const haystack = `${topic.title} ${topic.short} ${topic.architecture.join(" ")} ${topic.defense}`.toLowerCase();
    return matchesCategory && (!query || haystack.includes(query));
  });
}

function renderTopicList() {
  topicList.innerHTML = "";
  filteredTopics().forEach((topic) => {
    const button = document.createElement("button");
    button.className = `topic-button${topic.id === state.activeId ? " is-active" : ""}`;
    button.dataset.group = topic.group;
    button.type = "button";
    button.innerHTML = `
      <span class="topic-dot" aria-hidden="true"></span>
      <span>
        <span class="topic-title">${topic.title}</span>
        <span class="topic-desc">${topic.short}</span>
      </span>
    `;
    button.addEventListener("click", () => selectTopic(topic.id));
    topicList.appendChild(button);
  });
}

function updateInspector() {
  const topic = activeTopic();
  topicGroup.textContent = groupNames[topic.group];
  topicTitle.textContent = topic.title;
  architecture.innerHTML = "";
  topic.architecture.forEach((layer, index) => {
    const chip = document.createElement("div");
    chip.className = "layer-chip";
    chip.innerHTML = `<i>${index + 1}</i><span>${layer}</span>`;
    architecture.appendChild(chip);
  });
  observations.innerHTML = "";
  topic.observations.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    observations.appendChild(li);
  });
  formulaBox.textContent = topic.formula;
  defenseNote.textContent = topic.defense;
}

function setMetrics(items) {
  metricStrip.innerHTML = "";
  items.forEach((item) => {
    const div = document.createElement("div");
    div.className = "metric";
    div.innerHTML = `<strong>${item.value}</strong><span>${item.label}</span>`;
    metricStrip.appendChild(div);
  });
}

function selectTopic(id) {
  state.activeId = id;
  state.time = 0;
  state.step = 0;
  state.tick = 0;
  state.local = createLocalState(id);
  renderTopicList();
  updateInspector();
  draw();
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const width = Math.max(480, rect.width);
  const height = Math.max(360, rect.height);
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  canvas.logicalWidth = width;
  canvas.logicalHeight = height;
  draw();
}

function clearCanvas() {
  const width = canvas.logicalWidth || canvas.clientWidth;
  const height = canvas.logicalHeight || canvas.clientHeight;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#fbfdff";
  ctx.fillRect(0, 0, width, height);
}

function draw() {
  clearCanvas();
  const topic = activeTopic();
  const renderer = renderers[topic.visual] || renderPipeline;
  const metrics = renderer(topic) || [];
  setMetrics(metrics);
}

function animationLoop(ts) {
  if (!state.lastTs) state.lastTs = ts;
  const dt = Math.min(0.05, (ts - state.lastTs) / 1000);
  state.lastTs = ts;
  if (state.playing) {
    state.time += dt * state.speed;
    state.tick += dt * state.speed;
    while (state.tick > 0.32) {
      advanceTopic();
      state.tick -= 0.32;
    }
    draw();
  }
  requestAnimationFrame(animationLoop);
}

function advanceTopic() {
  state.step += 1;
  const topic = activeTopic();
  if (topic.id === "dim-reduction") advancePca();
  if (topic.id === "rnn-lstm-gru") advanceSequenceModel();
  if (topic.id === "hopfield") advanceHopfield();
  if (topic.id === "som") advanceSom();
  if (topic.id === "art") advanceArt();
  if (topic.id === "boltzmann") advanceBoltzmann();
  if (topic.id === "reservoir") advanceReservoir();
  if (topic.id === "bandit") advanceBandit();
  if (topic.id === "evolution" || topic.id === "neuroevolution") advanceEvolution();
  if (topic.id === "mdp-bellman") advanceBellman();
  if (topic.id === "td-prediction") advanceTdPrediction();
  if (topic.id === "sarsa" || topic.id === "q-learning") advanceControlRl(topic.id);
  if (topic.id === "dqn-policy") advanceDeepRlModel();
}

function buildPcaModel(points) {
  const vectors = points.map((p) => [p.x, p.y, p.z]);
  const mean = [0, 1, 2].map((dim) => vectors.reduce((sum, v) => sum + v[dim], 0) / vectors.length);
  const centered = vectors.map((v) => v.map((value, dim) => value - mean[dim]));
  const cov = Array.from({ length: 3 }, (_, r) =>
    Array.from({ length: 3 }, (_, c) => centered.reduce((sum, v) => sum + v[r] * v[c], 0) / (centered.length - 1))
  );
  return { mean, centered, cov, totalVariance: cov[0][0] + cov[1][1] + cov[2][2] };
}

function matVec(matrix, vector) {
  return matrix.map((row) => row.reduce((sum, value, index) => sum + value * vector[index], 0));
}

function dot(a, b) {
  return a.reduce((sum, value, index) => sum + value * b[index], 0);
}

function normalizeVec(vector) {
  const norm = Math.hypot(...vector) || 1;
  return vector.map((value) => value / norm);
}

function orthogonalize(vector, basis) {
  const projection = dot(vector, basis);
  return normalizeVec(vector.map((value, index) => value - projection * basis[index]));
}

function advancePca() {
  const local = state.local;
  local.v1 = normalizeVec(matVec(local.cov, local.v1));
  local.v2 = orthogonalize(matVec(local.cov, local.v2), local.v1);
  local.iteration += 1;
}

function advanceSequenceModel() {
  const local = state.local;
  const x = local.inputs[local.index % local.inputs.length];
  const prev = local.h;
  const z = local.wx.map((row, neuron) => dot(row, x) + dot(local.wh[neuron], prev) + local.b[neuron]);
  const h = z.map((value) => Math.tanh(value));
  const gates = {
    input: sigmoid(0.7 * x[0] + 0.5 * x[1] - 0.3 * prev[2]),
    forget: sigmoid(0.8 - 0.6 * x[2] + 0.45 * prev[0]),
    output: sigmoid(0.25 + 0.7 * h[1] + 0.25 * x[2]),
  };
  local.h = h;
  local.gates = gates;
  local.history.push({ token: local.tokens[local.index % local.tokens.length], h: [...h], gates });
  if (local.history.length > 12) local.history.shift();
  local.index += 1;
}

function hopfieldPatterns() {
  const fromRows = (name, rows) => ({
    name,
    bits: rows.join("").split("").map((char) => (char === "1" ? 1 : -1)),
  });
  return [
    fromRows("X", ["10001", "01010", "00100", "01010", "10001"]),
    fromRows("T", ["11111", "00100", "00100", "00100", "00100"]),
    fromRows("L", ["10000", "10000", "10000", "10000", "11111"]),
  ];
}

function makeHopfieldWeights(patterns) {
  const n = patterns[0].length;
  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => {
      if (i === j) return 0;
      return patterns.reduce((sum, pattern) => sum + pattern[i] * pattern[j], 0) / n;
    })
  );
}

function hopfieldEnergy(bits, weights) {
  let energy = 0;
  for (let i = 0; i < bits.length; i += 1) {
    for (let j = 0; j < bits.length; j += 1) {
      energy += weights[i][j] * bits[i] * bits[j];
    }
  }
  return -0.5 * energy;
}

function advanceHopfield() {
  const local = state.local;
  const index = local.order[local.cursor % local.order.length];
  const field = dot(local.weights[index], local.current);
  const next = field >= 0 ? 1 : -1;
  const before = local.current[index];
  local.current[index] = next;
  local.cursor += 1;
  local.lastNeuron = index;
  local.lastField = field;
  local.updates.push({ index, before, after: next, field });
  if (local.updates.length > 18) local.updates.shift();
  if (before === next && state.noise > 0.82 && local.cursor % 18 === 0) {
    const flip = local.order[(local.cursor + 7) % local.order.length];
    local.current[flip] *= -1;
    local.lastNeuron = flip;
    local.lastField = dot(local.weights[flip], local.current);
  }
  local.energy.push(hopfieldEnergy(local.current, local.weights));
  if (local.energy.length > 34) local.energy.shift();
}

function advanceSom() {
  const local = state.local;
  const sample = data.points[local.sampleIndex % data.points.length];
  local.sampleIndex += 1;
  let best = local.nodes[0];
  let bestDist = Infinity;
  local.nodes.forEach((node) => {
    const dist = (node.x - sample.x) ** 2 + (node.y - sample.y) ** 2;
    if (dist < bestDist) {
      bestDist = dist;
      best = node;
    }
  });
  const radius = lerp(3.4, 0.7, clamp(state.step / 80, 0, 1));
  local.nodes.forEach((node) => {
    const gridDist = Math.hypot(node.gx - best.gx, node.gy - best.gy);
    const influence = Math.exp(-(gridDist ** 2) / (2 * radius ** 2));
    const mode = state.complexity < 0.35 ? (gridDist === 0 ? 1 : 0) : influence;
    const alpha = 0.13 * mode;
    node.x += alpha * (sample.x - node.x);
    node.y += alpha * (sample.y - node.y);
  });
  local.lastSample = sample;
  local.lastBest = best;
  local.lastRadius = radius;
}

function advanceArt() {
  const local = state.local;
  const input = local.inputs[local.inputIndex % local.inputs.length];
  const vigilance = lerp(0.45, 0.9, state.complexity);
  let best = -1;
  let bestMatch = -1;
  local.prototypes.forEach((proto, index) => {
    const match = artMatch(input, proto);
    if (match > bestMatch) {
      bestMatch = match;
      best = index;
    }
  });
  if (bestMatch >= vigilance) {
    local.prototypes[best] = local.prototypes[best].map((value, index) => (value && input[index] ? 1 : 0));
  } else if (local.prototypes.length < 5) {
    local.prototypes.push([...input]);
  }
  local.inputIndex += 1;
}

function artMatch(input, proto) {
  const overlap = input.reduce((sum, value, index) => sum + (value && proto[index] ? 1 : 0), 0);
  const active = input.reduce((sum, value) => sum + value, 0) || 1;
  return overlap / active;
}

function advanceBandit() {
  const local = state.local;
  const epsilon = lerp(0.04, 0.5, state.noise);
  const rand = mulberry32(state.step + 400)();
  let arm;
  if (rand < epsilon) {
    arm = Math.floor(mulberry32(state.step + 500)() * local.estimates.length);
  } else {
    arm = local.estimates.reduce((best, value, index, arr) => (value > arr[best] ? index : best), 0);
  }
  const rewardMean = local.trueRewards[arm];
  const reward = clamp(rewardMean + (mulberry32(state.step + 700)() - 0.5) * 0.42, 0, 1);
  local.counts[arm] += 1;
  const alpha = state.complexity > 0.5 ? 0.18 : 1 / local.counts[arm];
  local.estimates[arm] += alpha * (reward - local.estimates[arm]);
  local.lastArm = arm;
  local.totalReward += reward;
}

function advanceReservoir() {
  const local = state.local;
  local.t += 1;
  const input = Math.sin(local.t * 0.22) + 0.45 * Math.sin(local.t * 0.071);
  const target = Math.sin((local.t - 6) * 0.22);
  const next = local.h.map((_, i) => {
    const recurrent = local.wres[i].reduce((sum, weight, j) => sum + weight * local.h[j], 0);
    return Math.tanh(local.win[i] * input + recurrent);
  });
  const output = dot(local.wout, next);
  const error = target - output;
  const lr = 0.018;
  local.wout = local.wout.map((weight, i) => weight + lr * error * next[i]);
  local.h = next;
  local.input = input;
  local.target = target;
  local.output = output;
  local.error = error;
  local.history.push({ input, target, output });
  if (local.history.length > 72) local.history.shift();
}

function boltzmannTemp() {
  return lerp(0.35, 1.9, state.noise);
}

function rbmEnergy(visible, hidden, local) {
  let energy = 0;
  visible.forEach((value, index) => {
    energy -= local.vBias[index] * value;
  });
  hidden.forEach((value, index) => {
    energy -= local.hBias[index] * value;
  });
  visible.forEach((v, i) => {
    hidden.forEach((h, j) => {
      energy -= v * local.weights[i][j] * h;
    });
  });
  return energy;
}

function advanceBoltzmann() {
  const local = state.local;
  const temp = boltzmannTemp();
  const rand = mulberry32(5000 + state.step);
  if (local.phase === "h|v") {
    local.probs = local.hidden.map((_, j) => {
      const field = local.hBias[j] + local.visible.reduce((sum, v, i) => sum + v * local.weights[i][j], 0);
      return sigmoid(field / temp);
    });
    local.hidden = local.probs.map((prob) => (rand() < prob ? 1 : 0));
    local.phase = "v|h";
  } else {
    local.probs = local.visible.map((_, i) => {
      const field = local.vBias[i] + local.hidden.reduce((sum, h, j) => sum + h * local.weights[i][j], 0);
      return sigmoid(field / temp);
    });
    local.visible = local.probs.map((prob) => (rand() < prob ? 1 : 0));
    local.phase = "h|v";
  }
  local.energy.push(rbmEnergy(local.visible, local.hidden, local));
  if (local.energy.length > 40) local.energy.shift();
}

function advanceEvolution() {
  const local = state.local;
  const scored = local.population
    .map((item) => ({ ...item, fitness: fitness2d(item.x, item.y) }))
    .sort((a, b) => b.fitness - a.fitness);
  const eliteCount = 6;
  const elites = scored.slice(0, eliteCount);
  const rand = mulberry32(800 + local.generation);
  const next = elites.map((item) => ({ x: item.x, y: item.y, mutation: item.mutation }));
  while (next.length < local.population.length) {
    const a = elites[Math.floor(rand() * elites.length)];
    const b = elites[Math.floor(rand() * elites.length)];
    const sigma = lerp(0.38, 0.08, state.complexity) + state.noise * 0.16;
    const childX = clamp((a.x + b.x) / 2 + (rand() - 0.5) * sigma, -1, 1);
    const childY = clamp((a.y + b.y) / 2 + (rand() - 0.5) * sigma, -1, 1);
    next.push({ x: childX, y: childY, mutation: rand() });
  }
  local.population = next;
  local.bestPath.push({ x: elites[0].x, y: elites[0].y, fitness: elites[0].fitness });
  if (local.bestPath.length > 28) local.bestPath.shift();
  local.generation += 1;
}

function fitness(x) {
  return 0.58 + 0.24 * Math.sin(7 * x) + 0.18 * Math.cos(3 * x) - 0.22 * (x - 0.22) ** 2;
}

function fitness2d(x, y) {
  const peakA = Math.exp(-((x - 0.42) ** 2 + (y + 0.28) ** 2) / 0.16);
  const peakB = 0.74 * Math.exp(-((x + 0.48) ** 2 + (y - 0.34) ** 2) / 0.11);
  const ripple = 0.16 * Math.sin(7 * x) * Math.cos(6 * y);
  return clamp(0.18 + 0.58 * peakA + 0.38 * peakB + ripple, 0, 1);
}

const gridActions = [
  { name: "R", dx: 1, dy: 0 },
  { name: "U", dx: 0, dy: -1 },
  { name: "L", dx: -1, dy: 0 },
  { name: "D", dx: 0, dy: 1 },
];

const gridWorld = {
  width: 5,
  height: 5,
  start: { x: 0, y: 4 },
  goal: { x: 4, y: 0 },
  trap: { x: 2, y: 2 },
  walls: [{ x: 1, y: 2 }],
  gamma: 0.88,
};

function createGridWorldState(topicId, rand) {
  const q = Array.from({ length: 25 }, () => Array.from({ length: 4 }, () => rand() * 0.04));
  return {
    agent: { ...gridWorld.start },
    values: Array.from({ length: 25 }, () => 0),
    q,
    action: topicId === "sarsa" ? chooseGridAction(q, gridWorld.start, 0.18, rand) : 0,
    path: [{ ...gridWorld.start }],
    backupIndex: 0,
    last: {
      state: { ...gridWorld.start },
      action: 0,
      reward: 0,
      next: { ...gridWorld.start },
      nextAction: 0,
      target: 0,
      old: 0,
      tdError: 0,
      reason: "start",
    },
  };
}

function gridIndex(pos) {
  return pos.y * gridWorld.width + pos.x;
}

function sameCell(a, b) {
  return a.x === b.x && a.y === b.y;
}

function isWall(pos) {
  return gridWorld.walls.some((wall) => sameCell(wall, pos));
}

function isTerminal(pos) {
  return sameCell(pos, gridWorld.goal) || sameCell(pos, gridWorld.trap);
}

function stepGrid(pos, actionIndex) {
  const action = gridActions[actionIndex];
  const next = {
    x: clamp(pos.x + action.dx, 0, gridWorld.width - 1),
    y: clamp(pos.y + action.dy, 0, gridWorld.height - 1),
  };
  if (isWall(next)) return { next: { ...pos }, reward: -0.12 };
  if (sameCell(next, gridWorld.goal)) return { next, reward: 1 };
  if (sameCell(next, gridWorld.trap)) return { next, reward: -0.8 };
  return { next, reward: -0.04 };
}

function bestActionFromValues(values, pos) {
  return gridActions.reduce((best, _, index) => {
    const { next, reward } = stepGrid(pos, index);
    const score = reward + gridWorld.gamma * values[gridIndex(next)];
    return score > best.score ? { index, score } : best;
  }, { index: 0, score: -Infinity }).index;
}

function bestQAction(q, pos) {
  const row = q[gridIndex(pos)];
  return row.reduce((best, value, index, arr) => (value > arr[best] ? index : best), 0);
}

function chooseGridAction(q, pos, epsilon, rand) {
  if (rand() < epsilon) return Math.floor(rand() * gridActions.length);
  return bestQAction(q, pos);
}

function advanceBellman() {
  const local = state.local;
  let idx = local.backupIndex % 25;
  let pos = { x: idx % 5, y: Math.floor(idx / 5) };
  while (isWall(pos) || isTerminal(pos)) {
    local.backupIndex += 1;
    idx = local.backupIndex % 25;
    pos = { x: idx % 5, y: Math.floor(idx / 5) };
  }
  const old = local.values[idx];
  const candidates = gridActions.map((_, actionIndex) => {
    const { next, reward } = stepGrid(pos, actionIndex);
    return reward + gridWorld.gamma * local.values[gridIndex(next)];
  });
  const target = Math.max(...candidates);
  local.values[idx] = lerp(old, target, 0.55);
  local.agent = pos;
  local.last = {
    state: pos,
    action: candidates.indexOf(target),
    reward: target,
    next: pos,
    nextAction: candidates.indexOf(target),
    target,
    old,
    tdError: target - old,
    reason: "pełny backup z modelu przejść",
  };
  local.backupIndex += 1;
}

function advanceTdPrediction() {
  const local = state.local;
  const s = { ...local.agent };
  const actionIndex = bestActionFromValues(local.values, s);
  const { next, reward } = stepGrid(s, actionIndex);
  const idx = gridIndex(s);
  const old = local.values[idx];
  const target = reward + gridWorld.gamma * local.values[gridIndex(next)];
  local.values[idx] += 0.28 * (target - old);
  local.agent = isTerminal(next) ? { ...gridWorld.start } : next;
  local.path.push({ ...local.agent });
  if (local.path.length > 22) local.path.shift();
  local.last = {
    state: s,
    action: actionIndex,
    reward,
    next,
    nextAction: bestActionFromValues(local.values, next),
    target,
    old,
    tdError: target - old,
    reason: "polityka wybiera najlepszy sąsiad według V",
  };
}

function advanceControlRl(topicId) {
  const local = state.local;
  const rand = mulberry32(7300 + state.step);
  const epsilon = lerp(0.02, 0.42, state.noise);
  const s = { ...local.agent };
  const actionIndex = topicId === "sarsa" ? local.action : chooseGridAction(local.q, s, epsilon, rand);
  const greedy = bestQAction(local.q, s);
  const reason = actionIndex === greedy ? "greedy: największe Q(s,a)" : "eksploracja epsilon-greedy";
  const { next, reward } = stepGrid(s, actionIndex);
  const nextAction = chooseGridAction(local.q, next, epsilon, rand);
  const idx = gridIndex(s);
  const old = local.q[idx][actionIndex];
  const bootstrap = topicId === "sarsa"
    ? local.q[gridIndex(next)][nextAction]
    : Math.max(...local.q[gridIndex(next)]);
  const target = reward + gridWorld.gamma * (isTerminal(next) ? 0 : bootstrap);
  local.q[idx][actionIndex] += 0.32 * (target - old);
  local.values = local.q.map((row) => Math.max(...row));
  local.agent = isTerminal(next) ? { ...gridWorld.start } : next;
  local.action = topicId === "sarsa" ? nextAction : chooseGridAction(local.q, local.agent, epsilon, rand);
  local.path.push({ ...local.agent });
  if (local.path.length > 22) local.path.shift();
  local.last = { state: s, action: actionIndex, reward, next, nextAction, target, old, tdError: target - old, reason };
}

function advanceDeepRlModel() {
  const local = state.local;
  const sample = local.replay[local.replayIndex % local.replay.length];
  const old = local.dqnQ[sample.a];
  const target = sample.r + gridWorld.gamma * Math.max(...local.targetQ);
  const tdError = target - old;
  local.dqnQ[sample.a] += 0.22 * tdError;
  local.targetQ = local.targetQ.map((value, index) => lerp(value, local.dqnQ[index], 0.08));
  const action = local.policy.reduce((best, value, index, arr) => (value > arr[best] ? index : best), 0);
  const advantage = sample.r + 0.35 - local.policy[action];
  local.policy = softmax(local.policy.map((prob, index) => Math.log(prob + 1e-6) + (index === action ? 0.18 * advantage : -0.04 * advantage)));
  local.replayIndex += 1;
  local.tdError = tdError;
  local.sampledAction = action;
  local.advantage = advantage;
}

function axisArea() {
  const w = canvas.logicalWidth;
  const h = canvas.logicalHeight;
  return { x: 42, y: 34, w: w - 84, h: h - 72 };
}

function mapPoint(area, point) {
  return {
    x: area.x + point.x * area.w,
    y: area.y + point.y * area.h,
  };
}

function drawAxes(area, labelX = "cecha 1", labelY = "cecha 2") {
  ctx.strokeStyle = palette.line;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(area.x, area.y);
  ctx.lineTo(area.x, area.y + area.h);
  ctx.lineTo(area.x + area.w, area.y + area.h);
  ctx.stroke();
  label(labelX, area.x + area.w - 74, area.y + area.h + 25, palette.muted, 12, "left");
  label(labelY, area.x - 2, area.y - 12, palette.muted, 12, "left");
}

function renderTask(topic) {
  if (topic.id === "regression") return renderRegression();
  if (topic.id === "clustering") return renderClustering();
  if (topic.id === "dim-reduction") return renderDimReduction();
  return renderClassification();
}

function renderClassification() {
  const area = axisArea();
  drawAxes(area);
  const angle = 0.7 + Math.sin(state.step / 11) * 0.16;
  const offset = lerp(0.36, 0.58, state.complexity);
  ctx.save();
  ctx.globalAlpha = 0.16;
  ctx.fillStyle = palette.teal;
  ctx.beginPath();
  ctx.moveTo(area.x, area.y);
  ctx.lineTo(area.x + area.w, area.y);
  ctx.lineTo(area.x + area.w, area.y + area.h * offset);
  ctx.lineTo(area.x, area.y + area.h * (offset + 0.18));
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = palette.amber;
  ctx.beginPath();
  ctx.moveTo(area.x, area.y + area.h);
  ctx.lineTo(area.x + area.w, area.y + area.h);
  ctx.lineTo(area.x + area.w, area.y + area.h * offset);
  ctx.lineTo(area.x, area.y + area.h * (offset + 0.18));
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  ctx.strokeStyle = palette.ink;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(area.x + 40, area.y + area.h * (offset + 0.22 * Math.sin(angle)));
  ctx.lineTo(area.x + area.w - 30, area.y + area.h * (offset - 0.16 * Math.cos(angle)));
  ctx.stroke();
  data.points.forEach((point) => drawPoint(mapPoint(area, point), point.color, 4.8));
  label("granica decyzyjna", area.x + area.w * 0.57, area.y + area.h * 0.46, palette.ink, 13, "left");
  return [
    { value: formatPercent(0.72 + state.complexity * 0.18), label: "accuracy" },
    { value: formatPercent(state.noise), label: "szum" },
    { value: "CE", label: "strata" },
  ];
}

function renderRegression() {
  const area = axisArea();
  drawAxes(area, "x", "y");
  data.regression.forEach((point) => drawPoint(mapPoint(area, point), palette.violet, 4.2));
  ctx.strokeStyle = palette.teal;
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i <= 120; i += 1) {
    const x = i / 120;
    const wave = 0.58 - 0.32 * Math.sin(x * Math.PI * 1.35);
    const wiggle = Math.sin(x * Math.PI * 8 + state.step * 0.14) * state.noise * 0.04 * state.complexity;
    const y = clamp(wave + wiggle, 0.08, 0.92);
    const p = mapPoint(area, { x, y });
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();
  label("predykcja y_hat", area.x + area.w * 0.65, area.y + area.h * 0.22, palette.teal, 13, "left");
  return [
    { value: (0.19 - state.complexity * 0.08 + state.noise * 0.03).toFixed(2), label: "RMSE" },
    { value: "MSE", label: "cel" },
    { value: formatPercent(0.62 + state.complexity * 0.22), label: "R2" },
  ];
}

function renderClustering() {
  const area = axisArea();
  drawAxes(area);
  const t = clamp(state.step / 30, 0, 1);
  const centers = data.clusters.map((cluster, index) => ({
    x: lerp([0.2, 0.82, 0.48][index], cluster.x, t),
    y: lerp([0.8, 0.78, 0.18][index], cluster.y, t),
    c: cluster.c,
  }));
  data.points.forEach((point) => {
    const nearest = centers.reduce((best, center, index) => {
      const d = (point.x - center.x) ** 2 + (point.y - center.y) ** 2;
      return d < best.d ? { d, index } : best;
    }, { d: Infinity, index: 0 });
    const p = mapPoint(area, point);
    drawPoint(p, centers[nearest.index].c, 4.4);
    ctx.globalAlpha = 0.12;
    ctx.strokeStyle = centers[nearest.index].c;
    ctx.beginPath();
    const cp = mapPoint(area, centers[nearest.index]);
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(cp.x, cp.y);
    ctx.stroke();
    ctx.globalAlpha = 1;
  });
  centers.forEach((center, index) => {
    const p = mapPoint(area, center);
    ctx.fillStyle = center.c;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    label(`C${index + 1}`, p.x, p.y + 4, "#ffffff", 11, "center");
  });
  return [
    { value: "k=3", label: "klastry" },
    { value: formatPercent(t), label: "zbieżność" },
    { value: "SOM", label: "pokrewne" },
  ];
}

function renderDimReduction() {
  const local = state.local;
  const w = canvas.logicalWidth;
  const h = canvas.logicalHeight;
  const left = { x: 44, y: 48, w: w * 0.39, h: h - 96 };
  const right = { x: w * 0.56, y: 48, w: w * 0.36, h: h - 96 };
  drawPanelTitle("dane 3D: cechy wejściowe", left.x, left.y - 18);
  drawPanelTitle("rzut na PC1/PC2", right.x, right.y - 18);
  drawBox(left);
  drawBox(right);
  data.highDim.forEach((point, index) => {
    const depth = point.z;
    const p3 = {
      x: left.x + point.x * left.w + (depth - 0.5) * 52,
      y: left.y + point.y * left.h - (depth - 0.5) * 32,
    };
    drawPoint(p3, point.color, 3 + depth * 3);
    if (index % 18 === 0) line(p3.x, p3.y, p3.x + 34, p3.y - 22, palette.line, 1);
  });
  const projections = local.centered.map((vector, index) => ({
    u: dot(vector, local.v1),
    v: dot(vector, local.v2),
    color: data.highDim[index].color,
  }));
  const maxAbs = Math.max(0.001, ...projections.flatMap((p) => [Math.abs(p.u), Math.abs(p.v)]));
  line(right.x + right.w / 2, right.y + 20, right.x + right.w / 2, right.y + right.h - 20, palette.line, 1);
  line(right.x + 20, right.y + right.h / 2, right.x + right.w - 20, right.y + right.h / 2, palette.line, 1);
  projections.forEach((p) => {
    drawPoint({
      x: right.x + right.w / 2 + (p.u / maxAbs) * right.w * 0.42,
      y: right.y + right.h / 2 - (p.v / maxAbs) * right.h * 0.42,
    }, p.color, 4.2);
  });
  arrow(left.x + left.w + 22, left.y + left.h / 2, right.x - 24, right.y + right.h / 2, palette.ink);
  const pc1Var = dot(local.v1, matVec(local.cov, local.v1));
  const pc2Var = dot(local.v2, matVec(local.cov, local.v2));
  const explained = clamp((pc1Var + pc2Var) / local.totalVariance, 0, 1);
  label(`power iteration: ${local.iteration}`, w / 2, h / 2 - 18, palette.ink, 14, "center");
  label("PC1 maksymalizuje wariancję, PC2 jest ortogonalny do PC1", w / 2, h - 34, palette.muted, 13, "center");
  return [
    { value: "d -> 2", label: "wymiary" },
    { value: formatPercent(explained), label: "wariancja" },
    { value: String(local.iteration), label: "iteracje" },
  ];
}

function renderMlp(topic) {
  const w = canvas.logicalWidth;
  const h = canvas.logicalHeight;
  const layers = topic.id === "backprop" ? [4, 6, 5, 3] : [3, 5, 4, 2];
  const positions = drawNetwork(layers, 70, 54, w - 140, h - 120, {
    pulse: state.time,
    reverse: topic.id === "backprop" && Math.floor(state.step / 2) % 2 === 1,
  });
  if (topic.id === "backprop") {
    label("forward: aktywacje", w * 0.34, h - 34, palette.teal, 13, "center");
    label("backward: gradienty", w * 0.66, h - 34, palette.coral, 13, "center");
    ctx.strokeStyle = palette.coral;
    ctx.lineWidth = 2;
    positions.slice(1).reverse().forEach((layer, layerIndex) => {
      layer.slice(0, 2).forEach((node, index) => {
        const prevLayer = positions[positions.length - 2 - layerIndex];
        if (prevLayer && prevLayer[index]) arrow(node.x - 18, node.y, prevLayer[index].x + 18, prevLayer[index].y, palette.coral);
      });
    });
  } else {
    label("warstwy ukryte składają nieliniowe cechy", w / 2, h - 34, palette.muted, 13, "center");
  }
  return [
    { value: layers.reduce((sum, count) => sum + count, 0), label: "neurony" },
    { value: topic.id === "backprop" ? "grad" : "ReLU", label: "sygnał" },
    { value: "Dense", label: "warstwy" },
  ];
}

function renderCnn() {
  const w = canvas.logicalWidth;
  const h = canvas.logicalHeight;
  const top = 46;
  const inputCell = clamp(w * 0.032, 20, 26);
  const kernelCell = clamp(w * 0.028, 18, 22);
  const fmapCell = clamp(w * 0.034, 21, 27);
  const poolCell = clamp(w * 0.036, 23, 30);
  const gap = clamp(w * 0.045, 24, 34);
  const inputX = Math.max(26, w * 0.04);
  const kernelX = inputX + inputCell * 6 + gap;
  const fmapX = kernelX + kernelCell * 3 + gap;
  const poolX = fmapX + fmapCell * 4 + gap;
  const matrix = [
    [2, 2, 1, 0, 0, 1],
    [2, 3, 2, 1, 0, 0],
    [1, 3, 5, 3, 1, 0],
    [0, 1, 3, 5, 3, 1],
    [0, 0, 1, 2, 3, 2],
    [1, 0, 0, 1, 2, 2],
  ];
  const kernel = [
    [1, 0, -1],
    [1, 0, -1],
    [1, 0, -1],
  ];
  const pos = state.step % 16;
  const kx = pos % 4;
  const ky = Math.floor(pos / 4);
  drawMatrix(matrix, inputX, top + 36, inputCell, "wejście", { hx: kx, hy: ky, hw: 3, hh: 3 });
  drawMatrix(kernel, kernelX, top + 70, kernelCell, "filtr 3x3");
  arrow(inputX + inputCell * 6 + 10, top + 140, kernelX - 16, top + 140, palette.ink);
  const fmap = convolve2d(matrix, kernel);
  drawMatrix(fmap, fmapX, top + 54, fmapCell, "mapa cech");
  arrow(kernelX + kernelCell * 3 + 12, top + 140, fmapX - 18, top + 140, palette.ink);
  const pool = pool2d(fmap, state.complexity > 0.45 ? "max" : "avg");
  arrow(fmapX + fmapCell * 4 + 12, top + 140, poolX - 18, top + 140, palette.ink);
  drawMatrix(pool, poolX, top + 82, poolCell, state.complexity > 0.45 ? "max pooling" : "avg pooling");
  drawFeatureMaps(w * 0.16, h - 104, 4, "płytkie cechy");
  drawFeatureMaps(w * 0.39, h - 104, 5, "głębsze cechy");
  drawFeatureMaps(w * 0.60, h - 104, 3, "wyjście / decoder");
  return [
    { value: "3x3", label: "filtr" },
    { value: state.complexity > 0.45 ? "max" : "avg", label: "pooling" },
    { value: "wspólne", label: "wagi" },
  ];
}

function convolve2d(matrix, kernel) {
  const out = [];
  for (let y = 0; y <= matrix.length - kernel.length; y += 1) {
    const row = [];
    for (let x = 0; x <= matrix[0].length - kernel[0].length; x += 1) {
      let sum = 0;
      for (let ky = 0; ky < kernel.length; ky += 1) {
        for (let kx = 0; kx < kernel[0].length; kx += 1) {
          sum += matrix[y + ky][x + kx] * kernel[ky][kx];
        }
      }
      row.push(sum);
    }
    out.push(row);
  }
  return out;
}

function pool2d(matrix, mode) {
  const out = [];
  for (let y = 0; y < matrix.length; y += 2) {
    const row = [];
    for (let x = 0; x < matrix[0].length; x += 2) {
      const values = [matrix[y][x], matrix[y][x + 1], matrix[y + 1][x], matrix[y + 1][x + 1]];
      row.push(mode === "max" ? Math.max(...values) : Math.round(values.reduce((a, b) => a + b, 0) / values.length));
    }
    out.push(row);
  }
  return out;
}

function renderSequence() {
  const local = state.local;
  const w = canvas.logicalWidth;
  const h = canvas.logicalHeight;
  const tokens = local.tokens;
  const y = h * 0.34;
  const start = w * 0.14;
  const gap = (w * 0.72) / (tokens.length - 1);
  tokens.forEach((token, index) => {
    const x = start + gap * index;
    const active = index === (local.index - 1 + tokens.length) % tokens.length;
    drawCell(x, y, token, active ? palette.teal : palette.muted);
    if (index > 0) arrow(x - gap + 38, y, x - 38, y, palette.ink);
    arrow(x, y + 44, x, y + 86, palette.violet);
    label(index < local.history.length ? local.history[Math.max(0, local.history.length - tokens.length + index)]?.h?.[0]?.toFixed(2) || "h" : "h", x, y + 118, palette.violet, 12, "center");
  });
  const gateX = w * 0.13;
  ["input", "forget", "output"].forEach((name, index) => {
    const value = local.gates[name];
    drawGauge(gateX, h * 0.64 + index * 34, w * 0.27, 18, value, [palette.teal, palette.amber, palette.violet][index]);
    label(`${name} gate ${value.toFixed(2)}`, gateX + w * 0.29, h * 0.64 + index * 34 + 14, palette.ink, 12, "left");
  });
  const chart = { x: w * 0.52, y: h * 0.58, w: w * 0.34, h: h * 0.25 };
  drawBox(chart);
  label("historia h_t[0]", chart.x + 8, chart.y - 10, palette.muted, 12, "left");
  if (local.history.length > 1) {
    ctx.strokeStyle = palette.teal;
    ctx.lineWidth = 3;
    ctx.beginPath();
    local.history.forEach((item, index) => {
      const x = chart.x + (index / (local.history.length - 1)) * chart.w;
      const yLine = chart.y + chart.h / 2 - item.h[0] * chart.h * 0.38;
      if (index === 0) ctx.moveTo(x, yLine);
      else ctx.lineTo(x, yLine);
    });
    ctx.stroke();
  }
  label("h_t = tanh(Wx x_t + Wh h_{t-1} + b), bramki pokazują intuicję LSTM/GRU", w / 2, h - 34, palette.muted, 13, "center");
  return [
    { value: "h_t", label: "stan" },
    { value: tokens[(local.index - 1 + tokens.length) % tokens.length], label: "token" },
    { value: local.h[0].toFixed(2), label: "aktywacja" },
  ];
}

function renderTransformer() {
  const w = canvas.logicalWidth;
  const h = canvas.logicalHeight;
  const tokens = ["nu", "ta", "śpie", "wu", "pitch"];
  const embeddings = [
    [0.8, 0.1, 0.4],
    [0.72, 0.35, 0.28],
    [0.12, 0.9, 0.55],
    [0.22, 0.6, 0.82],
    [0.45, 0.42, 0.95],
  ];
  const wq = [[0.7, -0.2, 0.25], [0.1, 0.6, 0.45], [-0.25, 0.3, 0.72]];
  const wk = [[0.62, 0.14, -0.22], [-0.1, 0.78, 0.24], [0.22, 0.42, 0.58]];
  const wv = [[0.52, -0.12, 0.32], [0.18, 0.48, 0.34], [-0.18, 0.24, 0.76]];
  const q = embeddings.map((v) => matVec(wq, v));
  const k = embeddings.map((v) => matVec(wk, v));
  const values = embeddings.map((v) => matVec(wv, v));
  const attention = q.map((query) => softmax(k.map((key) => dot(query, key) / Math.sqrt(3))));
  const activeRow = state.step % tokens.length;
  const compact = w < 760;
  const top = compact ? 36 : 72;
  const tokenGap = compact ? Math.min(78, (w - 108) / tokens.length) : Math.min(90, w * 0.1);
  const left = compact ? 38 : 54;
  tokens.forEach((token, index) => {
    const tx = left + index * tokenGap;
    drawToken(tx, top, token, index === activeRow);
    if (!compact) {
      arrow(tx + 32, top + 58, tx + 32, top + 104, palette.teal);
      label(index === activeRow ? "Q" : "K/V", tx + 32, top + 132, palette.teal, 13, "center");
    }
  });
  const matrixSize = compact ? Math.min(210, w - 92) : Math.min(250, w * 0.32);
  const cell = matrixSize / tokens.length;
  const tokenEnd = left + (tokens.length - 1) * tokenGap + 64;
  const matrixX = compact ? (w - matrixSize) / 2 : Math.min(w - matrixSize - 46, tokenEnd + 74);
  const matrixY = compact ? 164 : 72;
  label("softmax(QK^T / sqrt(d))", matrixX + matrixSize / 2, matrixY - 18, palette.ink, 14, "center");
  for (let y = 0; y < tokens.length; y += 1) {
    for (let x = 0; x < tokens.length; x += 1) {
      const value = attention[y][x];
      ctx.fillStyle = blend("#ffffff", y === activeRow ? palette.teal : palette.violet, 0.18 + value * 0.82);
      ctx.fillRect(matrixX + x * cell, matrixY + y * cell, cell - 4, cell - 4);
      label(value.toFixed(2), matrixX + x * cell + cell / 2, matrixY + y * cell + cell / 2 + 4, value > 0.42 ? "#ffffff" : palette.ink, 10, "center");
    }
  }
  const output = [0, 1, 2].map((dim) => attention[activeRow].reduce((sum, weight, index) => sum + weight * values[index][dim], 0));
  const boxY = compact ? h - 112 : h - 122;
  drawBox({ x: 62, y: boxY, w: w - 124, h: 70 });
  label(`query: "${tokens[activeRow]}" miesza V -> [${output.map((v) => v.toFixed(2)).join(", ")}]`, w / 2, boxY + 28, palette.ink, 14, "center");
  label("im jaśniejszy wiersz, tym większa waga attention dla danego tokenu", w / 2, boxY + 52, palette.muted, 12, "center");
  return [
    { value: "QK^T", label: "podobieństwo" },
    { value: "softmax", label: "wagi" },
    { value: tokens[activeRow], label: "query" },
  ];
}

function renderAutoencoder() {
  const w = canvas.logicalWidth;
  const h = canvas.logicalHeight;
  const layers = [6, 4, 2, 4, 6];
  const positions = drawNetwork(layers, 72, 54, w - 144, h - 118, { pulse: state.time });
  const bottleneck = positions[2];
  ctx.fillStyle = palette.amberSoft;
  ctx.strokeStyle = palette.amber;
  ctx.lineWidth = 2;
  roundRect(ctx, bottleneck[0].x - 34, bottleneck[0].y - 48, 68, bottleneck[1].y - bottleneck[0].y + 96, 8);
  ctx.fill();
  ctx.stroke();
  label("bottleneck z", bottleneck[0].x, bottleneck[1].y + 72, palette.amber, 13, "center");
  label("encoder", w * 0.28, 42, palette.teal, 14, "center");
  label("decoder", w * 0.72, 42, palette.violet, 14, "center");
  label("rekonstrukcja ma być podobna do wejścia, ale kod ma być użyteczny", w / 2, h - 34, palette.muted, 13, "center");
  return [
    { value: "x -> z", label: "kompresja" },
    { value: "z -> x_hat", label: "dekoder" },
    { value: "MSE", label: "rekonstrukcja" },
  ];
}

function renderHopfield() {
  const local = state.local;
  const w = canvas.logicalWidth;
  const h = canvas.logicalHeight;
  const cell = clamp(w * 0.045, 20, 29);
  const currentX = w * 0.09;
  const targetX = w * 0.39;
  const baseX = w * 0.68;
  const top = h * 0.15;
  drawPattern(local.current, currentX, top, cell, "stan po aktualizacjach", local.lastNeuron);
  drawPattern(local.target, targetX, top, cell, "atraktor najbliższy");
  arrow(currentX + cell * 5.4, top + cell * 2.5, targetX - 22, top + cell * 2.5, palette.teal);
  label("baza wzorców Hebba", baseX, top - 14, palette.ink, 13, "left");
  local.patterns.forEach((pattern, index) => {
    drawPattern(pattern.bits, baseX, top + index * (cell * 1.55), cell * 0.48, pattern.name);
  });
  const fieldY = top + cell * 5.6;
  label(`aktualizowany neuron: ${local.lastNeuron >= 0 ? local.lastNeuron + 1 : "-"} | pole h_i=${local.lastField.toFixed(2)}`, currentX, fieldY, palette.ink, 13, "left");
  label("reguła: s_i = sign(sum_j w_ij s_j)", currentX, fieldY + 22, palette.muted, 12, "left");
  const chart = { x: w * 0.12, y: h * 0.68, w: w * 0.76, h: h * 0.18 };
  drawBox(chart);
  label("energia E", chart.x + 10, chart.y - 10, palette.muted, 12, "left");
  const values = local.energy;
  if (values.length > 1) {
    ctx.strokeStyle = palette.coral;
    ctx.lineWidth = 3;
    ctx.beginPath();
    values.forEach((value, index) => {
      const x = chart.x + (index / (values.length - 1)) * chart.w;
      const y = chart.y + chart.h - clamp((value + 24) / 12, 0, 1) * chart.h;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }
  const wrong = local.current.reduce((sum, value, index) => sum + (value === local.target[index] ? 0 : 1), 0);
  return [
    { value: String(wrong), label: "błędne bity" },
    { value: values.at(-1).toFixed(1), label: "energia" },
    { value: state.showValues ? "+/-" : "grid", label: "pola" },
  ];
}

function renderSom() {
  const local = state.local;
  const w = canvas.logicalWidth;
  const h = canvas.logicalHeight;
  const left = { x: 50, y: 54, w: w * 0.42, h: h - 120 };
  const right = { x: w * 0.58, y: 54, w: w * 0.32, h: h - 120 };
  drawPanelTitle("przestrzeń danych", left.x, left.y - 18);
  drawPanelTitle("siatka SOM: prototypy i U-matrix", right.x, right.y - 18);
  drawBox(left);
  drawBox(right);
  data.points.forEach((point) => drawPoint(mapPoint(left, point), point.color, 3.8));
  for (let gy = 0; gy < 8; gy += 1) {
    for (let gx = 0; gx < 8; gx += 1) {
      const node = local.nodes.find((item) => item.gx === gx && item.gy === gy);
      const rightNode = local.nodes.find((item) => item.gx === gx + 1 && item.gy === gy);
      const downNode = local.nodes.find((item) => item.gx === gx && item.gy === gy + 1);
      if (rightNode) {
        const a = mapPoint(left, node);
        const b = mapPoint(left, rightNode);
        line(a.x, a.y, b.x, b.y, "rgba(23,33,43,0.18)", 1);
      }
      if (downNode) {
        const a = mapPoint(left, node);
        const b = mapPoint(left, downNode);
        line(a.x, a.y, b.x, b.y, "rgba(23,33,43,0.18)", 1);
      }
    }
  }
  local.nodes.forEach((node) => {
    const p = mapPoint(left, node);
    const isBest = node === local.lastBest;
    drawPoint(p, isBest ? palette.amber : palette.ink, isBest ? 7 : 2.6);
  });
  const samplePoint = mapPoint(left, local.lastSample || data.points[0]);
  drawNode(samplePoint.x, samplePoint.y, 9, palette.coral, "#ffffff");
  if (local.lastBest) {
    const bmu = mapPoint(left, local.lastBest);
    arrow(samplePoint.x, samplePoint.y, bmu.x, bmu.y, palette.coral);
  }
  local.nodes.forEach((node) => {
    const cell = Math.min(right.w, right.h) / 8;
    const gridX = right.x + 18 + node.gx * cell;
    const gridY = right.y + 28 + node.gy * cell;
    const neighbors = local.nodes.filter((other) => Math.abs(other.gx - node.gx) + Math.abs(other.gy - node.gy) === 1);
    const u = neighbors.length
      ? neighbors.reduce((sum, other) => sum + Math.hypot(other.x - node.x, other.y - node.y), 0) / neighbors.length
      : 0;
    const color = rgbFromPosition(node.x, node.y);
    ctx.fillStyle = color;
    ctx.fillRect(gridX, gridY, cell - 2, cell - 2);
    ctx.globalAlpha = clamp(u * 0.7, 0, 0.35);
    ctx.fillStyle = palette.ink;
    ctx.fillRect(gridX, gridY, cell - 2, cell - 2);
    ctx.globalAlpha = 1;
    if (node === local.lastBest) {
      ctx.strokeStyle = palette.amber;
      ctx.lineWidth = 3;
      ctx.strokeRect(gridX + 1, gridY + 1, cell - 4, cell - 4);
    }
  });
  const radius = local.lastRadius || lerp(3.4, 0.7, clamp(state.step / 80, 0, 1));
  label(state.complexity < 0.35 ? "tryb WTA: aktualizuje się tylko BMU" : "tryb WTM: BMU + sąsiedzi poruszają się razem", w / 2, h - 38, palette.muted, 13, "center");
  return [
    { value: radius.toFixed(1), label: "promień" },
    { value: String(local.nodes.length), label: "neurony" },
    { value: local.lastBest ? `${local.lastBest.gx},${local.lastBest.gy}` : "BMU", label: "BMU" },
  ];
}

function renderArt() {
  const local = state.local;
  const w = canvas.logicalWidth;
  const h = canvas.logicalHeight;
  const input = local.inputs[local.inputIndex % local.inputs.length];
  const vigilance = lerp(0.45, 0.9, state.complexity);
  label("wejście", w * 0.16, 48, palette.ink, 14, "center");
  drawBitRow(input, w * 0.07, 72, 32);
  label(`vigilance = ${vigilance.toFixed(2)}`, w * 0.48, 48, palette.violet, 14, "center");
  drawGauge(w * 0.38, 76, w * 0.22, 20, vigilance, palette.violet);
  local.prototypes.forEach((proto, index) => {
    const y = 132 + index * 58;
    drawBitRow(proto, w * 0.07, y, 24);
    const match = artMatch(input, proto);
    drawGauge(w * 0.38, y + 2, w * 0.22, 18, match, match >= vigilance ? palette.green : palette.coral);
    label(`kat. ${index + 1} match ${match.toFixed(2)}`, w * 0.65, y + 17, palette.ink, 13, "left");
  });
  const decision = local.prototypes.some((proto) => artMatch(input, proto) >= vigilance) ? "rezonans" : "nowa kategoria";
  label(decision, w * 0.5, h - 48, decision === "rezonans" ? palette.green : palette.coral, 18, "center");
  return [
    { value: String(local.prototypes.length), label: "kategorie" },
    { value: vigilance.toFixed(2), label: "czujność" },
    { value: decision, label: "decyzja" },
  ];
}

function renderBoltzmann() {
  const local = state.local;
  const w = canvas.logicalWidth;
  const h = canvas.logicalHeight;
  const temp = boltzmannTemp();
  const leftX = w * 0.14;
  const rightX = w * 0.43;
  const top = h * 0.18;
  const gapV = h * 0.085;
  const gapH = h * 0.115;
  const visibleNodes = local.visible.map((value, index) => ({ x: leftX, y: top + index * gapV, value }));
  const hiddenNodes = local.hidden.map((value, index) => ({ x: rightX, y: top + 20 + index * gapH, value }));
  visibleNodes.forEach((v, i) => {
    hiddenNodes.forEach((hh, j) => {
      const weight = local.weights[i][j];
      ctx.globalAlpha = 0.18 + Math.min(0.34, Math.abs(weight) * 0.28);
      line(v.x, v.y, hh.x, hh.y, weight >= 0 ? palette.teal : palette.coral, 1 + Math.abs(weight) * 1.8);
      ctx.globalAlpha = 1;
    });
  });
  visibleNodes.forEach((node, index) => {
    drawNode(node.x, node.y, 18, node.value ? palette.teal : "#dce5ea", node.value ? "#ffffff" : palette.muted);
    label(`v${index + 1}`, node.x - 34, node.y + 4, palette.muted, 12, "right");
  });
  hiddenNodes.forEach((node, index) => {
    drawNode(node.x, node.y, 18, node.value ? palette.violet : "#dce5ea", node.value ? "#ffffff" : palette.muted);
    label(`h${index + 1}`, node.x + 34, node.y + 4, palette.muted, 12, "left");
  });
  const probPanel = { x: w * 0.58, y: h * 0.16, w: w * 0.32, h: h * 0.32 };
  drawBox(probPanel);
  label(`Gibbs: ${local.phase}`, probPanel.x + 12, probPanel.y + 24, palette.ink, 13, "left");
  const probs = local.probs.length ? local.probs : local.hidden.map((_, j) => sigmoid((local.hBias[j] + local.visible.reduce((sum, v, i) => sum + v * local.weights[i][j], 0)) / temp));
  probs.slice(0, 6).forEach((prob, index) => {
    drawGauge(probPanel.x + 18, probPanel.y + 50 + index * 26, probPanel.w - 36, 14, prob, index % 2 ? palette.violet : palette.teal);
    label(`p${index + 1}=${prob.toFixed(2)}`, probPanel.x + 22, probPanel.y + 61 + index * 26, palette.ink, 10, "left");
  });
  const chart = { x: w * 0.58, y: h * 0.56, w: w * 0.32, h: h * 0.25 };
  drawBox(chart);
  label("energia próbek", chart.x + 8, chart.y - 10, palette.muted, 12, "left");
  if (local.energy.length > 1) {
    ctx.strokeStyle = palette.coral;
    ctx.lineWidth = 3;
    ctx.beginPath();
    const minE = Math.min(...local.energy);
    const maxE = Math.max(...local.energy);
    local.energy.forEach((energy, index) => {
      const x = chart.x + (index / (local.energy.length - 1)) * chart.w;
      const y = chart.y + chart.h - ((energy - minE) / Math.max(0.01, maxE - minE)) * chart.h;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }
  label("wysoka temperatura = więcej losowości; niska = silniejszy spadek energii", w / 2, h - 42, palette.muted, 13, "center");
  return [
    { value: temp.toFixed(2), label: "temperatura" },
    { value: local.energy.at(-1)?.toFixed(2) || "E", label: "energia" },
    { value: local.phase, label: "krok" },
  ];
}

function renderReservoir() {
  const local = state.local;
  const w = canvas.logicalWidth;
  const h = canvas.logicalHeight;
  const centerX = w * 0.47;
  const centerY = h * 0.47;
  const nodes = circularNodes(centerX, centerY, Math.min(w, h) * 0.22, local.h.length);
  nodes.forEach((a, i) => {
    nodes.forEach((b, j) => {
      if (!local.wres[i] || Math.abs(local.wres[i][j]) < 0.001) return;
      ctx.globalAlpha = 0.12 + Math.abs(local.wres[i][j]) * 0.35;
      arrow(a.x, a.y, b.x, b.y, local.wres[i][j] >= 0 ? palette.teal : palette.coral);
      ctx.globalAlpha = 1;
    });
  });
  nodes.forEach((node, index) => {
    const active = (local.h[index] + 1) / 2;
    drawNode(node.x, node.y, 8 + active * 7, blend("#dce5ea", palette.teal, active), "#ffffff");
  });
  drawCell(w * 0.12, centerY, "x_t", palette.teal);
  drawCell(w * 0.84, centerY, "y_hat", palette.violet);
  arrow(w * 0.16, centerY, centerX - Math.min(w, h) * 0.24, centerY, palette.teal);
  arrow(centerX + Math.min(w, h) * 0.24, centerY, w * 0.78, centerY, palette.violet);
  const chart = { x: w * 0.08, y: h * 0.08, w: w * 0.84, h: h * 0.18 };
  drawBox(chart);
  label("wejście, target i odczyt", chart.x + 8, chart.y - 10, palette.muted, 12, "left");
  drawHistoryLine(local.history, chart, "input", palette.teal, 1.2);
  drawHistoryLine(local.history, chart, "target", palette.amber, 1.2);
  drawHistoryLine(local.history, chart, "output", palette.violet, 2.6);
  label("W_res jest zamrożone; uczy się tylko liniowy readout W_out", w / 2, h - 42, palette.muted, 13, "center");
  return [
    { value: local.input.toFixed(2), label: "x_t" },
    { value: local.output.toFixed(2), label: "y_hat" },
    { value: Math.abs(local.error).toFixed(2), label: "błąd" },
  ];
}

function renderSpiking() {
  const w = canvas.logicalWidth;
  const h = canvas.logicalHeight;
  const chart = { x: 58, y: 60, w: w - 116, h: h * 0.34 };
  drawBox(chart);
  label("potencjał błonowy", chart.x + 10, chart.y - 12, palette.muted, 12, "left");
  const threshold = chart.y + chart.h * 0.32;
  line(chart.x, threshold, chart.x + chart.w, threshold, palette.coral, 2);
  ctx.strokeStyle = palette.teal;
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i <= 120; i += 1) {
    const x = chart.x + (i / 120) * chart.w;
    const wave = (Math.sin(i * 0.18 + state.time * 3) + 1) / 2;
    const spike = wave > 0.82 ? 0.08 : 0.76 - wave * 0.4;
    const y = chart.y + chart.h * spike;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  const rasterTop = h * 0.55;
  for (let row = 0; row < 6; row += 1) {
    label(`n${row + 1}`, 42, rasterTop + row * 28 + 5, palette.muted, 11, "right");
    line(58, rasterTop + row * 28, w - 58, rasterTop + row * 28, palette.line, 1);
    for (let col = 0; col < 22; col += 1) {
      if ((col * 7 + row * 5 + state.step) % (4 + (row % 3)) === 0) {
        line(64 + col * ((w - 140) / 21), rasterTop + row * 28 - 9, 64 + col * ((w - 140) / 21), rasterTop + row * 28 + 9, palette.violet, 2);
      }
    }
  }
  return [
    { value: "theta", label: "próg" },
    { value: "spike", label: "wyjście" },
    { value: "reset", label: "po impulsie" },
  ];
}

function renderFuzzyElm() {
  const w = canvas.logicalWidth;
  const h = canvas.logicalHeight;
  const left = { x: 48, y: 68, w: w * 0.4, h: h * 0.34 };
  const right = { x: w * 0.58, y: 68, w: w * 0.34, h: h * 0.34 };
  drawBox(left);
  drawPanelTitle("ANFIS: funkcje przynależności", left.x, left.y - 18);
  ["niski", "średni", "wysoki"].forEach((name, index) => {
    const cx = left.x + left.w * (0.22 + index * 0.28);
    ctx.strokeStyle = [palette.teal, palette.amber, palette.violet][index];
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i <= 60; i += 1) {
      const x = left.x + (i / 60) * left.w;
      const y = left.y + left.h - Math.exp(-((x - cx) ** 2) / 1800) * left.h * 0.82;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    label(name, cx, left.y + left.h + 18, palette.muted, 11, "center");
  });
  drawBox(right);
  drawPanelTitle("ELM: losowy hidden, uczony readout", right.x, right.y - 18);
  drawNetwork([2, 8, 1], right.x + 24, right.y + 26, right.w - 48, right.h - 52, { pulse: state.time, compact: true });
  drawBox({ x: 66, y: h * 0.62, w: w - 132, h: 58 });
  label("ANFIS daje reguły if-then, ELM daje szybkie dopasowanie wyjścia", w / 2, h * 0.62 + 36, palette.ink, 14, "center");
  return [
    { value: "if-then", label: "ANFIS" },
    { value: "H+", label: "ELM" },
    { value: "readout", label: "uczone" },
  ];
}

function renderNeocognitron() {
  const w = canvas.logicalWidth;
  const h = canvas.logicalHeight;
  const layers = [
    { name: "wejście", maps: 1, color: palette.muted },
    { name: "S1", maps: 3, color: palette.teal },
    { name: "C1", maps: 3, color: palette.amber },
    { name: "S2", maps: 4, color: palette.violet },
    { name: "C2", maps: 2, color: palette.coral },
  ];
  layers.forEach((layer, index) => {
    const x = 60 + index * ((w - 140) / (layers.length - 1));
    for (let m = 0; m < layer.maps; m += 1) {
      ctx.fillStyle = blend("#ffffff", layer.color, 0.18 + m * 0.14);
      ctx.strokeStyle = layer.color;
      ctx.lineWidth = 1.5;
      roundRect(ctx, x + m * 8, h * 0.35 + m * 8, 72, 72, 7);
      ctx.fill();
      ctx.stroke();
    }
    label(layer.name, x + 36, h * 0.35 + 108, layer.color, 14, "center");
    if (index < layers.length - 1) arrow(x + 92, h * 0.43, x + ((w - 140) / (layers.length - 1)) - 18, h * 0.43, palette.ink);
  });
  label("S wykrywa cechy, C daje lokalną tolerancję", w / 2, 58, palette.ink, 16, "center");
  label("historyczna intuicja CNN: hierarchia map cech", w / 2, h - 46, palette.muted, 13, "center");
  return [
    { value: "S/C", label: "warstwy" },
    { value: "cechy", label: "hierarchia" },
    { value: "CNN", label: "prekursor" },
  ];
}

function renderBandit() {
  const local = state.local;
  const w = canvas.logicalWidth;
  const h = canvas.logicalHeight;
  const maxH = h * 0.5;
  const base = h * 0.72;
  const usable = Math.min(w - 120, 470);
  const start = Math.max(58, (w - usable) * 0.18);
  const gap = usable / (local.estimates.length - 1);
  local.estimates.forEach((estimate, index) => {
    const x = start + index * gap;
    const barH = estimate * maxH;
    ctx.fillStyle = index === local.lastArm ? palette.amber : palette.teal;
    ctx.fillRect(x - 22, base - barH, 44, barH);
    ctx.strokeStyle = palette.ink;
    ctx.strokeRect(x - 22, base - local.trueRewards[index] * maxH, 44, 2);
    label(`A${index + 1}`, x, base + 24, palette.ink, 13, "center");
    label(estimate.toFixed(2), x, base - barH - 8, palette.muted, 12, "center");
  });
  label("czarna kreska = średnia; słupek = Q(a)", w / 2, 46, palette.muted, 13, "center");
  const avg = local.totalReward / Math.max(1, state.step);
  return [
    { value: `eps ${lerp(0.04, 0.5, state.noise).toFixed(2)}`, label: "eksploracja" },
    { value: avg.toFixed(2), label: "średnia R" },
    { value: `A${local.lastArm + 1}`, label: "akcja" },
  ];
}

function renderRl(topic) {
  const local = state.local;
  const w = canvas.logicalWidth;
  const h = canvas.logicalHeight;
  const size = Math.min(h * 0.64, w * 0.42);
  const x0 = w * 0.09;
  const y0 = h * 0.14;
  const cell = size / 5;
  for (let y = 0; y < 5; y += 1) {
    for (let x = 0; x < 5; x += 1) {
      const idx = y * 5 + x;
      const value = clamp(local.values[idx], 0, 1);
      const pos = { x, y };
      ctx.fillStyle = isWall(pos) ? "#26313b" : blend("#ffffff", palette.violet, value);
      ctx.fillRect(x0 + x * cell, y0 + y * cell, cell - 2, cell - 2);
      if (sameCell(pos, gridWorld.goal)) {
        ctx.fillStyle = palette.green;
        ctx.fillRect(x0 + x * cell + 6, y0 + y * cell + 6, cell - 14, cell - 14);
        label("G", x0 + x * cell + cell / 2, y0 + y * cell + cell / 2 + 5, "#ffffff", 14, "center");
      } else if (sameCell(pos, gridWorld.trap)) {
        ctx.fillStyle = palette.coral;
        ctx.fillRect(x0 + x * cell + 6, y0 + y * cell + 6, cell - 14, cell - 14);
        label("T", x0 + x * cell + cell / 2, y0 + y * cell + cell / 2 + 5, "#ffffff", 14, "center");
      } else if (!isWall(pos)) {
        label(value.toFixed(2), x0 + x * cell + cell / 2, y0 + y * cell + cell / 2 + 5, value > 0.55 ? "#ffffff" : palette.ink, 11, "center");
        if (topic.id !== "td-prediction" && topic.id !== "mdp-bellman") {
          drawPolicyArrow(x0 + x * cell + cell / 2, y0 + y * cell + cell / 2 - 13, bestQAction(local.q, pos), value > 0.55 ? "#ffffff" : palette.ink);
        } else if (!isTerminal(pos)) {
          drawPolicyArrow(x0 + x * cell + cell / 2, y0 + y * cell + cell / 2 - 13, bestActionFromValues(local.values, pos), value > 0.55 ? "#ffffff" : palette.ink);
        }
      }
    }
  }
  local.path.forEach((point, index) => {
    ctx.globalAlpha = 0.18 + (index / Math.max(1, local.path.length - 1)) * 0.34;
    drawPoint({ x: x0 + point.x * cell + cell / 2, y: y0 + point.y * cell + cell / 2 }, palette.amber, 5);
    ctx.globalAlpha = 1;
  });
  const ax = x0 + local.agent.x * cell + cell / 2;
  const ay = y0 + local.agent.y * cell + cell / 2;
  drawNode(ax, ay, cell * 0.22, palette.amber, "#ffffff");
  label("agent", ax, ay + cell * 0.48, palette.ink, 12, "center");
  const panel = { x: w * 0.58, y: y0, w: w * 0.34, h: size };
  drawBox(panel);
  const title = topic.id === "mdp-bellman" ? "Bellman: value iteration" : topic.id === "td-prediction" ? "TD(0): predykcja V" : `${topic.title}`;
  label(title, panel.x + panel.w / 2, panel.y + 34, palette.ink, 15, "center");
  const last = local.last;
  const actionName = gridActions[last.action]?.name || "-";
  const nextActionName = gridActions[last.nextAction]?.name || "-";
  const lines = topic.id === "mdp-bellman"
    ? [
      `stan s=(${last.state.x},${last.state.y})`,
      `sprawdź wszystkie akcje`,
      `najlepsza akcja: ${actionName}`,
      `V(s): ${last.old.toFixed(2)} -> ${(last.old + 0.55 * last.tdError).toFixed(2)}`,
    ]
    : topic.id === "td-prediction"
      ? [
        `s=(${last.state.x},${last.state.y}), a=${actionName}`,
        `r=${last.reward.toFixed(2)}, s'=(${last.next.x},${last.next.y})`,
        `target=${last.target.toFixed(2)}`,
        `TD error=${last.tdError.toFixed(2)}`,
      ]
      : [
        `s=(${last.state.x},${last.state.y}), a=${actionName}`,
        actionName === gridActions[bestQAction(local.q, last.state)]?.name ? "decyzja: greedy" : "decyzja: eksploracja",
        topic.id === "sarsa" ? `target: Q(s',${nextActionName})` : "target: max Q(s',a)",
        `TD error=${last.tdError.toFixed(2)}`,
      ];
  lines.forEach((lineText, index) => {
    drawCell(panel.x + panel.w / 2, panel.y + 82 + index * 58, lineText, [palette.teal, palette.amber, palette.violet, palette.green][index]);
  });
  if (topic.id === "sarsa" || topic.id === "q-learning") {
    const qRow = local.q[gridIndex(local.agent)];
    qRow.forEach((value, index) => {
      const barX = panel.x + 28 + index * ((panel.w - 56) / 4);
      const base = panel.y + panel.h - 28;
      const barH = clamp(value + 0.2, 0, 1) * 70;
      ctx.fillStyle = index === bestQAction(local.q, local.agent) ? palette.amber : palette.violet;
      ctx.fillRect(barX, base - barH, 24, barH);
      label(gridActions[index].name, barX + 12, base + 18, palette.ink, 11, "center");
    });
  }
  return [
    { value: topic.id === "mdp-bellman" ? "model" : "sample", label: "źródło" },
    { value: gridWorld.gamma.toFixed(2), label: "gamma" },
    { value: `${local.agent.x},${local.agent.y}`, label: "stan" },
  ];
}

function renderDeepRl() {
  const local = state.local;
  const w = canvas.logicalWidth;
  const h = canvas.logicalHeight;
  const left = { x: w * 0.06, y: h * 0.1, w: w * 0.42, h: h * 0.68 };
  const right = { x: w * 0.54, y: h * 0.1, w: w * 0.38, h: h * 0.68 };
  drawBox(left);
  drawBox(right);
  label("DQN: replay + target network", left.x + left.w / 2, left.y + 26, palette.ink, 15, "center");
  drawMiniGrid(left.x + 22, left.y + 56, Math.min(116, left.w * 0.34));
  drawNetwork([5, 7, 4], left.x + left.w * 0.38, left.y + 54, left.w * 0.34, left.h * 0.38, { pulse: state.time, compact: true });
  const base = left.y + left.h - 72;
  local.dqnQ.forEach((value, index) => {
    const x = left.x + left.w * 0.14 + index * (left.w * 0.16);
    const barH = clamp(value, -0.2, 1) * 105;
    ctx.fillStyle = index === local.replay[local.replayIndex % local.replay.length]?.a ? palette.amber : palette.violet;
    ctx.fillRect(x, base - barH, 24, barH);
    label(gridActions[index].name, x + 12, base + 18, palette.ink, 11, "center");
  });
  const sample = local.replay[(local.replayIndex + local.replay.length - 1) % local.replay.length] || local.replay[0];
  label(`sample: s=(${sample.s.join(",")}), a=${gridActions[sample.a].name}, r=${sample.r.toFixed(2)}`, left.x + 18, left.y + left.h - 34, palette.muted, 12, "left");
  label(`TD error=${local.tdError.toFixed(2)}`, left.x + left.w - 18, left.y + left.h - 34, palette.coral, 12, "right");
  label("Policy gradient: bezpośrednio zmienia pi(a|s)", right.x + right.w / 2, right.y + 26, palette.ink, 15, "center");
  const center = { x: right.x + right.w * 0.33, y: right.y + right.h * 0.42 };
  drawNode(center.x, center.y, 28, palette.teal, "#ffffff");
  label("policy", center.x, center.y + 56, palette.teal, 13, "center");
  local.policy.forEach((prob, index) => {
    const angle = -Math.PI / 2 + index * (Math.PI / 2);
    const x = right.x + right.w * 0.66 + Math.cos(angle) * right.w * 0.18;
    const y = right.y + right.h * 0.42 + Math.sin(angle) * right.h * 0.22;
    arrow(center.x + 28, center.y, x - 20, y, index === local.sampledAction ? palette.amber : palette.muted);
    drawNode(x, y, 18 + prob * 16, index === local.sampledAction ? palette.amber : palette.violet, "#ffffff");
    label(`${gridActions[index].name} ${prob.toFixed(2)}`, x, y + 42, palette.ink, 11, "center");
  });
  drawBox({ x: right.x + 24, y: right.y + right.h - 118, w: right.w - 48, h: 72 });
  label(`grad log pi(a|s) * advantage`, right.x + right.w / 2, right.y + right.h - 86, palette.ink, 13, "center");
  label(`advantage=${local.advantage.toFixed(2)}`, right.x + right.w / 2, right.y + right.h - 60, palette.muted, 12, "center");
  label("DQN uczy wartości akcji, policy gradient uczy rozkładu akcji", w / 2, h - 42, palette.muted, 13, "center");
  return [
    { value: local.tdError.toFixed(2), label: "TD error" },
    { value: "replay", label: "DQN" },
    { value: local.policy[local.sampledAction].toFixed(2), label: "pi(a)" },
  ];
}

function renderEvolution() {
  const local = state.local;
  const w = canvas.logicalWidth;
  const h = canvas.logicalHeight;
  const area = { x: 54, y: 50, w: w - 108, h: h - 118 };
  drawBox(area);
  const cols = 26;
  const rows = 18;
  for (let gy = 0; gy < rows; gy += 1) {
    for (let gx = 0; gx < cols; gx += 1) {
      const x = (gx / (cols - 1)) * 2 - 1;
      const y = (gy / (rows - 1)) * 2 - 1;
      const value = fitness2d(x, y);
      ctx.fillStyle = blend("#ffffff", value > 0.55 ? palette.green : palette.violet, value);
      ctx.fillRect(area.x + (gx / cols) * area.w, area.y + (gy / rows) * area.h, area.w / cols + 1, area.h / rows + 1);
    }
  }
  const scored = local.population.map((item) => ({ ...item, fitness: fitness2d(item.x, item.y) }));
  const best = scored.reduce((a, b) => (b.fitness > a.fitness ? b : a), scored[0]);
  scored.forEach((item) => {
    const p = mapPoint(area, { x: (item.x + 1) / 2, y: (item.y + 1) / 2 });
    drawPoint(p, item === best ? palette.amber : palette.teal, item === best ? 8 : 4.5);
  });
  if (local.bestPath.length > 1) {
    ctx.strokeStyle = palette.coral;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    local.bestPath.forEach((item, index) => {
      const p = mapPoint(area, { x: (item.x + 1) / 2, y: (item.y + 1) / 2 });
      if (index === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();
  }
  label("jasne pola = wysoki fitness; punkty = populacja; linia = historia elity", w / 2, h - 36, palette.muted, 13, "center");
  return [
    { value: String(local.generation), label: "pokolenie" },
    { value: best.fitness.toFixed(2), label: "best fitness" },
    { value: "2D", label: "genotyp" },
  ];
}

function renderNeuroevolution() {
  const local = state.local;
  const w = canvas.logicalWidth;
  const h = canvas.logicalHeight;
  renderEvolution();
  const x = w * 0.62;
  const y = h * 0.18;
  drawBox({ x, y, w: w * 0.3, h: h * 0.36 });
  label("genom sieci", x + w * 0.15, y + 30, palette.ink, 14, "center");
  drawNetwork([2, 3 + (local.generation % 3), 2], x + 30, y + 58, w * 0.3 - 60, h * 0.23, { compact: true, pulse: state.time });
  label("+ neuron / + połączenie / mutacja wag", x + w * 0.15, y + h * 0.32, palette.muted, 12, "center");
  return [
    { value: "NEAT", label: "topologia" },
    { value: String(local.generation), label: "pokolenie" },
    { value: "specjacja", label: "ochrona" },
  ];
}

function renderPipeline() {
  const w = canvas.logicalWidth;
  const h = canvas.logicalHeight;
  const stages = [
    ["obraz", palette.muted],
    ["OMR", palette.teal],
    ["OCR tekstu", palette.amber],
    ["Score IR", palette.violet],
    ["akustyka", palette.coral],
    ["wokoder", palette.green],
  ];
  const gap = (w - 160) / (stages.length - 1);
  stages.forEach(([name, color], index) => {
    const x = 80 + gap * index;
    drawCell(x, h * 0.42, name, color);
    if (index < stages.length - 1) {
      const pulse = (state.time * 0.8 + index / stages.length) % 1;
      arrow(x + 44, h * 0.42, x + gap - 44, h * 0.42, palette.ink);
      drawPoint({ x: lerp(x + 52, x + gap - 52, pulse), y: h * 0.42 }, color, 5);
    }
  });
  drawScoreImage({ x: w * 0.07, y: h * 0.12, w: w * 0.18, h: h * 0.18 });
  label("OMR = symbole i pozycje nut, nie tylko tekst", w * 0.31, h * 0.24, palette.teal, 12, "left");
  drawBox({ x: w * 0.12, y: h * 0.65, w: w * 0.76, h: 70 });
  label("propagacja błędów: OMR box/klasa -> OCR tekstu -> Score IR -> mel/F0 -> waveform", w / 2, h * 0.65 + 42, palette.ink, 14, "center");
  return [
    { value: "6", label: "moduły" },
    { value: "OMR", label: "symbolika" },
    { value: "conf", label: "decyzje" },
  ];
}

function renderSegmentation() {
  const w = canvas.logicalWidth;
  const h = canvas.logicalHeight;
  drawUnet(w * 0.12, h * 0.18, w * 0.76, h * 0.46);
  const maskX = w * 0.2;
  const maskY = h * 0.72;
  drawMask(maskX, maskY, 220, 58);
  drawGauge(w * 0.56, h * 0.74, w * 0.28, 22, 0.74 + Math.sin(state.time) * 0.06, palette.green);
  label("Dice / IoU rośnie, gdy predykcja nachodzi na maskę referencyjną", w * 0.7, h * 0.72, palette.muted, 12, "center");
  return [
    { value: "skip", label: "szczegóły" },
    { value: "Dice", label: "strata" },
    { value: "mask", label: "wyjście" },
  ];
}

function renderDetection() {
  const w = canvas.logicalWidth;
  const h = canvas.logicalHeight;
  const img = { x: 46, y: 54, w: w * 0.38, h: h * 0.64 };
  drawScoreImage(img);
  const targets = [
    { x: 0.17, y: 0.22, w: 0.12, h: 0.1, cls: "notehead", score: 0.94 },
    { x: 0.43, y: 0.34, w: 0.1, h: 0.28, cls: "stem", score: 0.88 },
    { x: 0.63, y: 0.55, w: 0.16, h: 0.11, cls: "rest", score: 0.81 },
  ];
  const phase = state.step % 36;
  const refine = clamp((phase - 10) / 18, 0, 1);
  targets.forEach((target, index) => {
    const anchor = {
      x: target.x + [-0.08, 0.08, -0.04][index],
      y: target.y + [0.04, -0.06, 0.07][index],
      w: target.w * [1.8, 1.45, 1.7][index],
      h: target.h * [1.6, 1.3, 1.55][index],
    };
    const box = {
      x: lerp(anchor.x, target.x, refine),
      y: lerp(anchor.y, target.y, refine),
      w: lerp(anchor.w, target.w, refine),
      h: lerp(anchor.h, target.h, refine),
    };
    ctx.strokeStyle = phase < 10 ? palette.muted : phase < 24 ? palette.amber : palette.teal;
    ctx.lineWidth = phase < 10 ? 1.5 : 3;
    ctx.strokeRect(img.x + box.x * img.w, img.y + box.y * img.h, box.w * img.w, box.h * img.h);
    if (phase >= 24) label(`${target.cls} ${target.score.toFixed(2)}`, img.x + box.x * img.w, img.y + box.y * img.h - 5, palette.teal, 10, "left");
  });
  arrow(img.x + img.w + 34, img.y + img.h * 0.5, w * 0.58, img.y + img.h * 0.5, palette.ink);
  const blocks = ["backbone CNN", "RPN: anchors + objectness", "NMS + RoIAlign", "klasa + bbox delta"];
  blocks.forEach((block, index) => {
    const active = Math.floor(phase / 9) === index;
    drawCell(w * 0.66, 82 + index * 74, block, active ? palette.amber : [palette.teal, palette.amber, palette.violet, palette.coral][index]);
    if (index > 0) arrow(w * 0.62, 56 + index * 74, w * 0.62, 70 + index * 74, palette.muted);
  });
  const phaseText = phase < 10 ? "1. RPN tworzy dużo propozycji" : phase < 24 ? "2. bbox regression zawęża regiony" : "3. głowa klasyfikuje i zwraca finalne boxy";
  label(phaseText, w / 2, h - 42, palette.muted, 13, "center");
  return [
    { value: `${Math.round(refine * 100)}%`, label: "refinement" },
    { value: "RPN", label: "propozycje" },
    { value: "AP75", label: "precyzja" },
  ];
}

function renderOcr() {
  const w = canvas.logicalWidth;
  const h = canvas.logicalHeight;
  const cropX = w * 0.06;
  const cropW = Math.min(w * 0.24, 190);
  drawTextCrop(cropX, h * 0.16, cropW, 76);
  const featureX = cropX + cropW + 42;
  const featureY = h * 0.13;
  const cols = ["blank", "l", "a", "blank", "-", "l", "a", "blank"];
  const active = state.step % cols.length;
  const colStep = Math.min(26, w * 0.034);
  const barW = Math.max(14, colStep - 4);
  cols.forEach((token, index) => {
    const x = featureX + index * colStep;
    const height = 48 + (token === "blank" ? 6 : 30);
    ctx.fillStyle = index <= active ? blend("#ffffff", token === "blank" ? palette.muted : palette.teal, 0.45) : "#edf3f6";
    ctx.fillRect(x, featureY + 70 - height, barW, height);
    label(token === "blank" ? "_" : token, x + barW / 2, featureY + 92, palette.ink, 10, "center");
  });
  arrow(cropX + cropW + 14, h * 0.25, featureX - 20, h * 0.25, palette.ink);
  const raw = cols.slice(0, active + 1);
  const decoded = ctcDecode(raw);
  const outW = Math.min(w * 0.24, 190);
  const featureEnd = featureX + cols.length * colStep;
  const outX = Math.min(w - outW - 28, featureEnd + 34);
  if (outX > featureEnd + 28) {
    arrow(featureEnd + 10, h * 0.25, outX - 18, h * 0.25, palette.ink);
  }
  drawBox({ x: outX, y: h * 0.15, w: outW, h: 108 });
  label("CTC collapse", outX + 18, h * 0.2, palette.muted, 12, "left");
  label(raw.map((t) => (t === "blank" ? "_" : t)).join(" "), outX + 18, h * 0.27, palette.ink, 13, "left");
  label(`=> ${decoded || "..."}`, outX + 18, h * 0.35, palette.teal, 18, "left");
  drawBox({ x: w * 0.12, y: h * 0.62, w: w * 0.76, h: 78 });
  label("CNN robi kolumny cech, CRNN/Transformer daje tokeny, CTC usuwa blanki i powtórzenia", w / 2, h * 0.62 + 34, palette.ink, 13, "center");
  label("dla tekstu wokalnego ważne są też myślniki i podział sylab", w / 2, h * 0.62 + 58, palette.muted, 12, "center");
  return [
    { value: "CTC", label: "wariant" },
    { value: decoded || "_", label: "decode" },
    { value: "CER", label: "metryka" },
  ];
}

function renderSvs() {
  const w = canvas.logicalWidth;
  const h = canvas.logicalHeight;
  const y = h * 0.16;
  drawPianoRoll(44, y, w * 0.28, h * 0.24);
  const phonemes = [
    { text: "l", dur: 1 },
    { text: "aa", dur: 2 },
    { text: "-", dur: 1 },
    { text: "l", dur: 1 },
    { text: "aa", dur: 2 },
  ];
  const regX = w * 0.38;
  label("length regulator: fonemy -> ramki", regX, y - 10, palette.muted, 12, "left");
  let cursor = regX;
  phonemes.forEach((item, index) => {
    drawCell(cursor + item.dur * 18, y + 42, item.text, [palette.teal, palette.amber, palette.violet][index % 3]);
    for (let i = 0; i < item.dur; i += 1) {
      ctx.fillStyle = blend("#ffffff", palette.teal, 0.35 + index * 0.08);
      ctx.fillRect(cursor + i * 22, y + 90, 18, 34);
    }
    cursor += item.dur * 24 + 12;
  });
  arrow(w * 0.32, y + h * 0.12, regX - 22, y + h * 0.12, palette.ink);
  arrow(cursor + 10, y + 82, w * 0.72, y + 82, palette.ink);
  drawMel(w * 0.73, h * 0.15, w * 0.18, h * 0.3);
  const f0 = { x: w * 0.15, y: h * 0.58, w: w * 0.7, h: h * 0.18 };
  drawBox(f0);
  label("F0 z partytury + predykcja modelu", f0.x + 10, f0.y - 10, palette.muted, 12, "left");
  line(f0.x + 10, f0.y + f0.h * 0.55, f0.x + f0.w - 10, f0.y + f0.h * 0.55, palette.line, 1);
  ctx.strokeStyle = palette.amber;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let i = 0; i <= 100; i += 1) {
    const x = f0.x + 12 + (i / 100) * (f0.w - 24);
    const pitch = f0.y + f0.h * (0.55 - 0.24 * Math.sin(i * 0.08) - 0.08 * Math.sin(i * 0.21 + state.time));
    if (i === 0) ctx.moveTo(x, pitch);
    else ctx.lineTo(x, pitch);
  }
  ctx.stroke();
  label("tu widać sens SVS: zgodność rytmu, fonemów i wysokości przed wokoderem", w / 2, h - 42, palette.muted, 13, "center");
  return [
    { value: "dur", label: "ramki" },
    { value: "mel", label: "akustyka" },
    { value: "F0", label: "pitch" },
  ];
}

function renderSvsAcoustic() {
  const w = canvas.logicalWidth;
  const h = canvas.logicalHeight;
  const y = h * 0.26;
  const startX = w * 0.1;
  const blocks = [
    ["fonemy", palette.teal],
    ["Transformer", palette.violet],
    ["length reg.", palette.amber],
    ["Conformer", palette.coral],
    ["mel/F0/energy", palette.green],
  ];
  blocks.forEach(([name, color], index) => {
    const x = startX + index * ((w * 0.8) / (blocks.length - 1));
    drawCell(x, y, name, color);
    if (index < blocks.length - 1) {
      arrow(x + 54, y, startX + (index + 1) * ((w * 0.8) / (blocks.length - 1)) - 54, y, palette.ink);
    }
  });
  drawNetwork([4, 7, 7, 5], w * 0.18, h * 0.46, w * 0.42, h * 0.28, { pulse: state.time, compact: true });
  drawMel(w * 0.68, h * 0.48, Math.min(w * 0.2, 150), h * 0.22);
  label("event encoder uczy kontekst zdarzeń, frame decoder modeluje ramki akustyczne", w / 2, h - 42, palette.muted, 13, "center");
  return [
    { value: "10", label: "warstw enc." },
    { value: "8", label: "warstw dec." },
    { value: "512", label: "hidden" },
  ];
}

function renderVocoder() {
  const w = canvas.logicalWidth;
  const h = canvas.logicalHeight;
  const melX = w * 0.08;
  const midX = w * 0.39;
  const outX = w * 0.78;
  drawMel(melX, h * 0.19, Math.min(w * 0.22, 170), h * 0.36);
  drawGauge(melX, h * 0.64, Math.min(w * 0.22, 170), 18, 0.68 + Math.sin(state.time) * 0.12, palette.amber);
  label("F0 + energy", melX + Math.min(w * 0.22, 170) / 2, h * 0.69, palette.muted, 12, "center");
  arrow(melX + Math.min(w * 0.22, 170) + 22, h * 0.38, midX - 34, h * 0.38, palette.ink);
  const layers = ["proj", "up 1", "res", "up 2", "res"];
  layers.forEach((name, index) => {
    const x = midX + index * Math.min(54, w * 0.07);
    ctx.fillStyle = blend("#ffffff", index % 2 ? palette.violet : palette.teal, 0.28);
    ctx.strokeStyle = index % 2 ? palette.violet : palette.teal;
    roundRect(ctx, x, h * 0.25 - index * 5, 42, h * 0.26 + index * 10, 7);
    ctx.fill();
    ctx.stroke();
    label(name, x + 21, h * 0.56 + index * 7, palette.muted, 11, "center");
  });
  const harmonicX = midX + 40;
  ctx.strokeStyle = palette.amber;
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  for (let i = 0; i <= 120; i += 1) {
    const x = harmonicX + (i / 120) * Math.min(w * 0.24, 190);
    const y = h * 0.16 + Math.sin(i * 0.36 + state.time * 6) * 13;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  label("harmonic source zależne od F0", harmonicX + Math.min(w * 0.24, 190) / 2, h * 0.12, palette.amber, 12, "center");
  arrow(midX + Math.min(w * 0.31, 250), h * 0.38, outX - 20, h * 0.38, palette.ink);
  drawWave(outX, h * 0.27, Math.min(w * 0.15, 116), h * 0.22);
  label("generator + dyskryminatory uczą realistycznej fali i reakcji na pitch", w / 2, h - 42, palette.muted, 13, "center");
  return [
    { value: "HiFi-GAN", label: "inspiracja" },
    { value: "source", label: "F0" },
    { value: "GAN", label: "trening" },
  ];
}

function drawNetwork(layers, x, y, w, h, options = {}) {
  const positions = layers.map((count, layerIndex) => {
    const lx = x + (layers.length === 1 ? 0 : (layerIndex / (layers.length - 1)) * w);
    const gap = count > 1 ? h / (count - 1) : 0;
    return Array.from({ length: count }, (_, nodeIndex) => ({
      x: lx,
      y: y + (count === 1 ? h / 2 : nodeIndex * gap),
    }));
  });
  for (let i = 0; i < positions.length - 1; i += 1) {
    positions[i].forEach((a, ai) => {
      positions[i + 1].forEach((b, bi) => {
        const phase = Math.sin((options.pulse || 0) * 4 + i + ai * 0.7 + bi * 0.4);
        ctx.globalAlpha = options.compact ? 0.16 : 0.22 + Math.max(0, phase) * 0.18;
        line(a.x, a.y, b.x, b.y, options.reverse ? palette.coral : palette.muted, options.compact ? 1 : 1.2);
        ctx.globalAlpha = 1;
      });
    });
  }
  const highlightColor = options.reverse ? palette.coral : palette.teal;
  const highlightPhase = Math.floor(((options.pulse || 0) * 5 + state.step) % 1000);
  ctx.save();
  ctx.globalAlpha = state.playing ? 1 : 0.78;
  ctx.lineCap = "round";
  ctx.shadowColor = highlightColor;
  ctx.shadowBlur = options.compact ? 4 : 8;
  for (let i = 0; i < positions.length - 1; i += 1) {
    const fromLayer = positions[i];
    const toLayer = positions[i + 1];
    const from = fromLayer[(highlightPhase + i * 2) % fromLayer.length];
    const to = toLayer[(highlightPhase + i * 2 + 1) % toLayer.length];
    line(from.x, from.y, to.x, to.y, highlightColor, options.compact ? 3.2 : 4.8);
  }
  ctx.restore();
  positions.forEach((layer, layerIndex) => {
    layer.forEach((node, nodeIndex) => {
      const active = 0.5 + 0.5 * Math.sin((options.pulse || 0) * 3 + layerIndex + nodeIndex);
      const fill = layerIndex === 0 ? palette.teal : layerIndex === positions.length - 1 ? palette.violet : blend("#ffffff", palette.amber, 0.25 + active * 0.35);
      drawNode(node.x, node.y, options.compact ? 9 : 14, fill, layerIndex === 0 || layerIndex === positions.length - 1 ? "#ffffff" : palette.ink);
    });
  });
  return positions;
}

function drawMatrix(matrix, x, y, cell, title, highlight) {
  label(title, x + (matrix[0].length * cell) / 2, y - 12, palette.ink, 13, "center");
  matrix.forEach((row, ry) => {
    row.forEach((value, rx) => {
      const abs = Math.min(1, Math.abs(value) / 8);
      ctx.fillStyle = value >= 0 ? blend("#ffffff", palette.teal, abs) : blend("#ffffff", palette.coral, abs);
      ctx.fillRect(x + rx * cell, y + ry * cell, cell - 2, cell - 2);
      label(String(value), x + rx * cell + cell / 2, y + ry * cell + cell / 2 + 4, Math.abs(value) > 4 ? "#ffffff" : palette.ink, 11, "center");
    });
  });
  if (highlight) {
    ctx.strokeStyle = palette.amber;
    ctx.lineWidth = 3;
    ctx.strokeRect(x + highlight.hx * cell, y + highlight.hy * cell, highlight.hw * cell - 2, highlight.hh * cell - 2);
  }
}

function drawFeatureMaps(x, y, count, title) {
  for (let i = 0; i < count; i += 1) {
    ctx.fillStyle = blend("#ffffff", [palette.teal, palette.amber, palette.violet][i % 3], 0.22 + i * 0.08);
    ctx.strokeStyle = palette.line;
    roundRect(ctx, x + i * 10, y + i * 4, 58, 46, 6);
    ctx.fill();
    ctx.stroke();
  }
  label(title, x + 44, y + 70, palette.muted, 12, "center");
}

function drawPattern(pattern, x, y, cell, title, highlightIndex = -1) {
  label(title, x + cell * 2.5, y - 14, palette.ink, 13, "center");
  pattern.forEach((value, index) => {
    const px = x + (index % 5) * cell;
    const py = y + Math.floor(index / 5) * cell;
    const active = value > 0;
    ctx.fillStyle = active ? palette.ink : "#e4edf2";
    ctx.fillRect(px, py, cell - 3, cell - 3);
    if (index === highlightIndex) {
      ctx.strokeStyle = palette.amber;
      ctx.lineWidth = 3;
      ctx.strokeRect(px + 1, py + 1, cell - 5, cell - 5);
    }
    if (state.showValues && cell >= 16) {
      label(active ? "+1" : "-1", px + cell / 2 - 1, py + cell / 2 + 4, active ? "#ffffff" : palette.muted, Math.max(8, cell * 0.32), "center");
    }
  });
}

function drawBitRow(bits, x, y, cell) {
  bits.forEach((bit, index) => {
    ctx.fillStyle = bit ? palette.teal : "#e2e8ee";
    ctx.fillRect(x + index * (cell + 5), y, cell, cell);
    label(String(bit), x + index * (cell + 5) + cell / 2, y + cell / 2 + 4, bit ? "#ffffff" : palette.muted, 11, "center");
  });
}

function drawGauge(x, y, w, h, value, color) {
  ctx.fillStyle = "#edf2f5";
  roundRect(ctx, x, y, w, h, 7);
  ctx.fill();
  ctx.fillStyle = color;
  roundRect(ctx, x, y, w * clamp(value, 0, 1), h, 7);
  ctx.fill();
  ctx.strokeStyle = palette.line;
  ctx.stroke();
}

function drawEnergyLandscape(area, temp) {
  drawBox(area);
  ctx.strokeStyle = palette.violet;
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i <= 100; i += 1) {
    const x = i / 100;
    const y = 0.55 + 0.28 * Math.sin(x * Math.PI * 4) + 0.13 * Math.cos(x * Math.PI * 9);
    const px = area.x + x * area.w;
    const py = area.y + y * area.h;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
  const ballX = area.x + ((Math.sin(state.time * (2 / temp)) + 1) / 2) * area.w;
  const ballY = area.y + area.h * (0.25 + 0.45 * Math.abs(Math.sin(state.time * 1.7)));
  drawNode(ballX, ballY, 10, palette.amber, "#ffffff");
  label("krajobraz energii", area.x + area.w / 2, area.y + area.h + 22, palette.muted, 12, "center");
}

function drawUnet(x, y, w, h) {
  const left = [0, 1, 2, 3].map((i) => ({ x: x + i * (w * 0.12), y: y + i * (h * 0.12), w: w * 0.12, h: h * (0.76 - i * 0.12) }));
  const right = [0, 1, 2, 3].map((i) => ({ x: x + w - (i + 1) * (w * 0.12), y: y + i * (h * 0.12), w: w * 0.12, h: h * (0.76 - i * 0.12) }));
  [...left, ...right].forEach((box, index) => {
    ctx.fillStyle = blend("#ffffff", index < 4 ? palette.teal : palette.violet, 0.18 + (index % 4) * 0.08);
    ctx.strokeStyle = index < 4 ? palette.teal : palette.violet;
    roundRect(ctx, box.x, box.y, box.w, box.h, 7);
    ctx.fill();
    ctx.stroke();
  });
  left.forEach((box, index) => {
    const target = right[index];
    arrow(box.x + box.w, box.y + box.h * 0.5, target.x, target.y + target.h * 0.5, palette.amber);
  });
  label("encoder", x + w * 0.18, y - 14, palette.teal, 13, "center");
  label("decoder", x + w * 0.82, y - 14, palette.violet, 13, "center");
  label("skip connections", x + w * 0.5, y + h * 0.44, palette.amber, 13, "center");
}

function drawMask(x, y, w, h) {
  ctx.fillStyle = "#eef3f4";
  roundRect(ctx, x, y, w, h, 8);
  ctx.fill();
  ctx.fillStyle = "rgba(31, 122, 140, 0.75)";
  for (let i = 0; i < 9; i += 1) {
    roundRect(ctx, x + 16 + i * 20, y + 18 + Math.sin(i) * 7, 16, 18, 4);
    ctx.fill();
  }
  ctx.strokeStyle = palette.amber;
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 14, y + 14, w * 0.78, h * 0.55);
}

function drawScoreImage(area) {
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, area.x, area.y, area.w, area.h, 8);
  ctx.fill();
  ctx.strokeStyle = palette.line;
  ctx.stroke();
  for (let row = 0; row < 5; row += 1) {
    const y = area.y + area.h * (0.18 + row * 0.11);
    line(area.x + 22, y, area.x + area.w - 22, y, "#b9c4cb", 1);
  }
  for (let i = 0; i < 9; i += 1) {
    const x = area.x + area.w * (0.14 + i * 0.085);
    const y = area.y + area.h * (0.24 + (i % 4) * 0.08);
    ctx.fillStyle = palette.ink;
    ctx.beginPath();
    ctx.ellipse(x, y, 7, 5, -0.4, 0, Math.PI * 2);
    ctx.fill();
    line(x + 7, y, x + 7, y - 38, palette.ink, 2);
  }
}

function drawTextCrop(x, y, w, h) {
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, x, y, w, h, 8);
  ctx.fill();
  ctx.strokeStyle = palette.line;
  ctx.stroke();
  label("la - la la", x + w / 2, y + h / 2 + 8, palette.ink, 30, "center", "Georgia, serif");
}

function drawPianoRoll(x, y, w, h) {
  drawBox({ x, y, w, h });
  for (let i = 0; i < 6; i += 1) {
    line(x, y + (i / 6) * h, x + w, y + (i / 6) * h, palette.line, 1);
  }
  const notes = [
    [0.05, 0.55, 0.18],
    [0.25, 0.42, 0.17],
    [0.45, 0.34, 0.22],
    [0.7, 0.48, 0.2],
  ];
  notes.forEach((note, index) => {
    ctx.fillStyle = [palette.teal, palette.amber, palette.violet, palette.coral][index];
    roundRect(ctx, x + note[0] * w, y + note[1] * h, note[2] * w, 20, 6);
    ctx.fill();
  });
  label("nuty + sylaby", x + w / 2, y + h + 22, palette.muted, 12, "center");
}

function drawMel(x, y, w, h) {
  drawBox({ x, y, w, h });
  for (let row = 0; row < 16; row += 1) {
    for (let col = 0; col < 20; col += 1) {
      const value = Math.abs(Math.sin(row * 0.5 + col * 0.28 + state.time));
      ctx.fillStyle = blend("#17212b", "#f2c14e", value);
      ctx.fillRect(x + (col / 20) * w, y + (row / 16) * h, w / 20 + 1, h / 16 + 1);
    }
  }
  label("mel-spektrogram", x + w / 2, y + h + 22, palette.muted, 12, "center");
}

function drawWave(x, y, w, h) {
  drawBox({ x, y, w, h });
  ctx.strokeStyle = palette.green;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= 120; i += 1) {
    const px = x + (i / 120) * w;
    const py = y + h / 2 + Math.sin(i * 0.28 + state.time * 8) * h * 0.26 * Math.sin(i / 120 * Math.PI);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
  label("waveform", x + w / 2, y + h + 22, palette.muted, 12, "center");
}

function drawMiniGrid(x, y, size) {
  const cell = size / 5;
  for (let row = 0; row < 5; row += 1) {
    for (let col = 0; col < 5; col += 1) {
      ctx.fillStyle = row === 0 && col === 4 ? palette.green : "#eef3f4";
      ctx.fillRect(x + col * cell, y + row * cell, cell - 2, cell - 2);
    }
  }
  drawNode(x + cell / 2, y + size - cell / 2, 11, palette.amber, "#ffffff");
}

function drawHistoryLine(history, area, key, color, width = 2) {
  if (!history || history.length < 2) return;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  history.forEach((item, index) => {
    const value = clamp((item[key] + 1.4) / 2.8, 0, 1);
    const x = area.x + (index / (history.length - 1)) * area.w;
    const y = area.y + area.h - value * area.h;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
}

function drawPolicyArrow(x, y, actionIndex, color) {
  const action = gridActions[actionIndex] || gridActions[0];
  const len = 13;
  arrow(x - action.dx * 2, y - action.dy * 2, x + action.dx * len, y + action.dy * len, color);
}

function ctcDecode(tokens) {
  const out = [];
  let prev = "";
  tokens.forEach((token) => {
    if (token !== "blank" && token !== prev) out.push(token);
    prev = token;
  });
  return out.join("");
}

function circularNodes(cx, cy, radius, count) {
  return Array.from({ length: count }, (_, index) => {
    const angle = -Math.PI / 2 + (index / count) * Math.PI * 2;
    return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius };
  });
}

function drawPoint(point, color, radius) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawNode(x, y, radius, fill, textColor) {
  ctx.fillStyle = fill;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  if (textColor) {
    ctx.fillStyle = textColor;
    ctx.beginPath();
    ctx.arc(x, y, Math.max(2, radius * 0.18), 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCell(x, y, text, color) {
  const width = Math.max(68, text.length * 8 + 26);
  ctx.fillStyle = blend("#ffffff", color, 0.18);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  roundRect(ctx, x - width / 2, y - 22, width, 44, 8);
  ctx.fill();
  ctx.stroke();
  label(text, x, y + 5, palette.ink, 13, "center");
}

function drawToken(x, y, text, active) {
  ctx.fillStyle = active ? palette.teal : "#eef3f4";
  ctx.strokeStyle = active ? palette.teal : palette.line;
  roundRect(ctx, x, y, 64, 42, 8);
  ctx.fill();
  ctx.stroke();
  label(text, x + 32, y + 27, active ? "#ffffff" : palette.ink, 13, "center");
}

function line(x1, y1, x2, y2, color, width = 1) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function arrow(x1, y1, x2, y2, color) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  line(x1, y1, x2, y2, color, 2);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - Math.cos(angle - 0.45) * 10, y2 - Math.sin(angle - 0.45) * 10);
  ctx.lineTo(x2 - Math.cos(angle + 0.45) * 10, y2 - Math.sin(angle + 0.45) * 10);
  ctx.closePath();
  ctx.fill();
}

function drawBox(area) {
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.strokeStyle = palette.line;
  ctx.lineWidth = 1;
  roundRect(ctx, area.x, area.y, area.w, area.h, 8);
  ctx.fill();
  ctx.stroke();
}

function drawPanelTitle(text, x, y) {
  label(text, x, y, palette.muted, 12, "left");
}

function label(text, x, y, color = palette.ink, size = 12, align = "left", font = "Inter, system-ui, sans-serif") {
  ctx.fillStyle = color;
  ctx.font = `700 ${size}px ${font}`;
  ctx.textAlign = align;
  ctx.textBaseline = "alphabetic";
  ctx.fillText(text, x, y);
}

function roundRect(context, x, y, w, h, radius) {
  const r = Math.min(radius, w / 2, h / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + w, y, x + w, y + h, r);
  context.arcTo(x + w, y + h, x, y + h, r);
  context.arcTo(x, y + h, x, y, r);
  context.arcTo(x, y, x + w, y, r);
  context.closePath();
}

function blend(a, b, amount) {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  const t = clamp(amount, 0, 1);
  return `rgb(${Math.round(lerp(ca.r, cb.r, t))}, ${Math.round(lerp(ca.g, cb.g, t))}, ${Math.round(lerp(ca.b, cb.b, t))})`;
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function rgbFromPosition(x, y) {
  const r = Math.round(70 + x * 130);
  const g = Math.round(100 + y * 110);
  const b = Math.round(150 + (1 - x) * 80);
  return `rgb(${r}, ${g}, ${b})`;
}

document.querySelectorAll(".category-tab").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".category-tab").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    state.category = button.dataset.category;
    const visible = filteredTopics();
    if (!visible.some((topic) => topic.id === state.activeId) && visible[0]) {
      state.activeId = visible[0].id;
      state.local = createLocalState(state.activeId);
      updateInspector();
    }
    renderTopicList();
    draw();
  });
});

topicSearch.addEventListener("input", () => {
  state.query = topicSearch.value;
  renderTopicList();
});

playBtn.addEventListener("click", () => {
  state.playing = !state.playing;
  playBtn.querySelector("span").textContent = state.playing ? "Pauza" : "Start";
});

stepBtn.addEventListener("click", () => {
  advanceTopic();
  state.time += 0.18;
  draw();
});

resetBtn.addEventListener("click", () => {
  selectTopic(state.activeId);
});

valueToggleBtn.addEventListener("click", () => {
  state.showValues = !state.showValues;
  valueToggleBtn.classList.toggle("is-active", state.showValues);
  valueToggleBtn.setAttribute("aria-pressed", String(state.showValues));
  valueToggleBtn.querySelector("span").textContent = state.showValues ? "Wartości: on" : "Wartości";
  draw();
});

speedRange.addEventListener("input", () => {
  state.speed = Number(speedRange.value);
});

noiseRange.addEventListener("input", () => {
  state.noise = Number(noiseRange.value);
  draw();
});

complexityRange.addEventListener("input", () => {
  state.complexity = Number(complexityRange.value);
  draw();
});

window.addEventListener("resize", resizeCanvas);

state.local = createLocalState(state.activeId);
renderTopicList();
updateInspector();
resizeCanvas();
requestAnimationFrame(animationLoop);
