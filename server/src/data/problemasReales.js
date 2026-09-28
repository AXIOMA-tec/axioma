// ---------------------------------------------------------------------------
// problemasReales.js — el contenido real de tres competencias, transcrito de
// los archivos LaTeX que dio el equipo:
//   - OMMU Primera Ronda (2024-2026)
//   - OMMU Concurso Nacional (2024-2026)
//   - Putnam (2021-2025)
//
// Este archivo es solo DATOS (sin conexión a Mongo, sin lógica de base de
// datos) -- seed.js lo importa y hace el trabajo de guardarlo. Separar los
// datos así significa que agregar más problemas en el futuro es solo
// agregar entradas a los arreglos de aquí abajo, sin tocar seed.js.
//
// IMPORTANTE sobre cómo está escrito el LaTeX aquí abajo: cada enunciado usa
// String.raw`...` en vez de comillas normales. La razón es técnica pero
// real: en un string de JavaScript normal, una barra invertida seguida de
// ciertas letras tiene un significado especial ("\n" es un salto de línea,
// "\f" es un carácter invisible de "form feed") -- y el LaTeX está LLENO de
// comandos que empiezan con "\" (\frac, \sum, \sqrt, \neq...). Si
// escribiéramos estos enunciados con comillas normales, JavaScript
// "comería" esas barras invertidas silenciosamente y el LaTeX quedaría roto
// sin ningún error visible. String.raw le dice a JavaScript "no le hagas
// nada especial a las barras invertidas, guarda el texto exactamente como
// está escrito" -- exactamente lo que KaTeX necesita recibir.
//
// dificultad/exito: estimaciones ilustrativas basadas en un patrón conocido
// (el problema #1 de cada ronda/sección es más accesible que el último) --
// NO son datos reales de examen, porque no existen estadísticas públicas de
// qué % de gente resolvió cada uno de estos problemas específicos.
// ---------------------------------------------------------------------------

export const categorias = [
  { key: 'putnam', name: 'Putnam', parent: null },
  { key: 'putnam-1985', name: '1985', parent: 'putnam' },
  { key: 'putnam-1986', name: '1986', parent: 'putnam' },
  { key: 'putnam-1987', name: '1987', parent: 'putnam' },
  { key: 'putnam-1988', name: '1988', parent: 'putnam' },
  { key: 'putnam-1989', name: '1989', parent: 'putnam' },
  { key: 'putnam-1990', name: '1990', parent: 'putnam' },
  { key: 'putnam-1991', name: '1991', parent: 'putnam' },
  { key: 'putnam-1992', name: '1992', parent: 'putnam' },
  { key: 'putnam-1993', name: '1993', parent: 'putnam' },
  { key: 'putnam-1994', name: '1994', parent: 'putnam' },
  { key: 'putnam-2021', name: '2021', parent: 'putnam' },
  { key: 'putnam-2022', name: '2022', parent: 'putnam' },
  { key: 'putnam-2023', name: '2023', parent: 'putnam' },
  { key: 'putnam-2024', name: '2024', parent: 'putnam' },
  { key: 'putnam-2025', name: '2025', parent: 'putnam' },

  { key: 'ommu-pr', name: 'OMMU Primera Ronda', parent: null },
  { key: 'ommu-pr-2024', name: '2024', parent: 'ommu-pr' },
  { key: 'ommu-pr-2025', name: '2025', parent: 'ommu-pr' },
  { key: 'ommu-pr-2026', name: '2026', parent: 'ommu-pr' },

  { key: 'ommu-nac', name: 'OMMU Nacional', parent: null },
  { key: 'ommu-nac-2024', name: '2024', parent: 'ommu-nac' },
  { key: 'ommu-nac-2025', name: '2025', parent: 'ommu-nac' },
  { key: 'ommu-nac-2026', name: '2026', parent: 'ommu-nac' },
]

// posicion = lugar del problema dentro de su ronda/sección (1 = primero).
function estimarPutnam(posicion) {
  const tabla = [
    { dificultad: 'Media', exito: 45 },
    { dificultad: 'Difícil', exito: 24 },
    { dificultad: 'Difícil', exito: 14 },
    { dificultad: 'Difícil', exito: 9 },
    { dificultad: 'Difícil', exito: 5 },
    { dificultad: 'Difícil', exito: 3 },
  ]
  return tabla[posicion - 1]
}

function estimarOMMU(posicion) {
  const tabla = [
    { dificultad: 'Media', exito: 48 },
    { dificultad: 'Media', exito: 36 },
    { dificultad: 'Difícil', exito: 24 },
    { dificultad: 'Difícil', exito: 15 },
    { dificultad: 'Difícil', exito: 9 },
    { dificultad: 'Difícil', exito: 7 },
  ]
  return tabla[posicion - 1]
}

// ===========================================================================
// OMMU — PRIMERA RONDA
// ===========================================================================

const ommuPrimeraRonda = [
  // --- 2024 ---
  {
    codigo: 'OMMU-PR-2024-1',
    titulo: 'Raíces de la derivada de p²',
    categoriaKey: 'ommu-pr-2024',
    año: '2024',
    tema: 'Análisis',
    tipo: 'OMMU Primera Ronda',
    ...estimarOMMU(1),
    enunciado: String.raw`Demuestra que si $p(x)$ es un polinomio de grado $n$ con coeficientes reales y $n$ raíces reales distintas, entonces el polinomio $(p^2)'(x)$ tiene $2n-1$ raíces reales distintas.`,
  },
  {
    codigo: 'OMMU-PR-2024-2',
    titulo: 'Derivada de det(J+tA)',
    categoriaKey: 'ommu-pr-2024',
    año: '2024',
    tema: 'Álgebra Lineal',
    tipo: 'OMMU Primera Ronda',
    ...estimarOMMU(2),
    enunciado: String.raw`Sea $A$ una matriz real de $n \times n$, $J$ la matriz de $n \times n$ cuyas entradas son todas $1$, y $f(t) = \det(J+tA)$. Encuentra $f'(0)$.`,
  },
  {
    codigo: 'OMMU-PR-2024-3',
    titulo: 'Periodo de un corrimiento binario',
    categoriaKey: 'ommu-pr-2024',
    año: '2024',
    tema: 'Combinatoria',
    tipo: 'OMMU Primera Ronda',
    ...estimarOMMU(3),
    enunciado: String.raw`Sea $x=(x_1,x_2,\dots,x_n)$ una sucesión de $0$'s y $1$'s. Considera la función $\rho(x)=\rho(x_1,\dots,x_n)=(x_2,\dots,x_n,x_1)$ que desplaza la primera entrada al final. Sean $u=|\{i \mid x_i=1\}|$ y $v=|\{i \mid x_i=0\}|$ la cantidad de unos y ceros en $x$, respectivamente. Dado que $|u-v|=1$, demuestra que $\rho^t(x)=x$ si y solo si $n \mid t$.`,
  },
  {
    codigo: 'OMMU-PR-2024-4',
    titulo: 'Conjuntos independientes en un ciclo con cola',
    categoriaKey: 'ommu-pr-2024',
    año: '2024',
    tema: 'Combinatoria',
    tipo: 'OMMU Primera Ronda',
    ...estimarOMMU(4),
    enunciado: String.raw`Considera una gráfica $G(n,m)$ que se obtiene al identificar un vértice de un ciclo de $n$ aristas con un extremo de un camino de $m$ aristas.

Un conjunto de vértices se considera bueno si no hay dos de ellos que sean vecinos (es decir, no comparten ninguna arista). Sea $f(n,m,k)$ la cantidad de conjuntos buenos de tamaño $k$ en $G(n,m)$. Encuentra $f(n,m,k)$.`,
  },
  {
    codigo: 'OMMU-PR-2024-5',
    titulo: 'Funciones con f(f(x)) = x⁴',
    categoriaKey: 'ommu-pr-2024',
    año: '2024',
    tema: 'Álgebra',
    tipo: 'OMMU Primera Ronda',
    ...estimarOMMU(5),
    enunciado: String.raw`Encuentra todas las funciones $f:(0,\infty)\rightarrow(0,\infty)$ que satisfacen:
(i) $f(xy)=f(x)f(y)$
(ii) $f(f(x))=x^4$
(iii) $$\lim_{x\rightarrow\infty}f(x)=0$$`,
  },

  // --- 2025 ---
  {
    codigo: 'OMMU-PR-2025-1',
    titulo: 'Suma alternante sobre subconjuntos',
    categoriaKey: 'ommu-pr-2025',
    año: '2025',
    tema: 'Combinatoria',
    tipo: 'OMMU Primera Ronda',
    ...estimarOMMU(1),
    enunciado: String.raw`Sea $n$ un número natural y considera $A_n=\{1,2,\dots,n\}$. Para un subconjunto $B\subset A_n$, sea $S_B=a_r-a_{r-1}+a_{r-2}+\dots+(-1)^{r-1}a_1$ si $B=\{a_r>a_{r-1}>\dots>a_1\}$. Calcula:
$$\sum_{B\subset A_n}S_B$$`,
  },
  {
    codigo: 'OMMU-PR-2025-2',
    titulo: 'Convergencia de una suma sobre potencias de primo',
    categoriaKey: 'ommu-pr-2025',
    año: '2025',
    tema: 'Análisis',
    tipo: 'OMMU Primera Ronda',
    ...estimarOMMU(2),
    enunciado: String.raw`Sea $A=\{n\in\mathbb{N} \mid n \text{ es una potencia de primo compuesta}\}$. Sea $f(n)$ el promedio de los divisores de $n$. Demuestra que la siguiente suma converge:
$$\sum_{n\in A}\frac{1}{f(n)}$$
Nota: Un número compuesto es aquel que puede expresarse como el producto de dos números mayores que uno. Una potencia de primo es el resultado de multiplicar un mismo número primo por sí mismo varias veces (por ejemplo, $2^3=2\times2\times2$).`,
  },
  {
    codigo: 'OMMU-PR-2025-3',
    titulo: 'Matrices sin raíces de x² + px + q',
    categoriaKey: 'ommu-pr-2025',
    año: '2025',
    tema: 'Álgebra Lineal',
    tipo: 'OMMU Primera Ronda',
    ...estimarOMMU(3),
    enunciado: String.raw`Sean $p,q\in\mathbb{R}$ tales que para todo número real $x\in\mathbb{R}$, $x^2+px+q\neq 0$. Si $n$ es un entero positivo impar, demuestra que para toda matriz cuadrada $X$ de $n\times n$ con entradas reales:
$$X^2+pX+qI_n\neq O_n$$
Nota: $I_n$ representa la matriz identidad de orden $n$, es decir, una matriz cuadrada de tamaño $n\times n$ con unos en la diagonal principal y ceros en el resto. $O_n$ representa la matriz de $n\times n$ cuyas entradas son todas cero.`,
  },
  {
    codigo: 'OMMU-PR-2025-4',
    titulo: 'Curva tangente a círculos desde una elipse',
    categoriaKey: 'ommu-pr-2025',
    año: '2025',
    tema: 'Geometría',
    tipo: 'OMMU Primera Ronda',
    ...estimarOMMU(4),
    enunciado: String.raw`Sea $\Gamma$ una elipse con focos $A$ y $B$. Para cada punto $P\in\Gamma$ se traza un círculo $C(P)$ con centro en $P$ que pasa por el punto $B$. Demuestra que existe una curva cerrada que es tangente a todos los círculos $C(P)$ y que el área encerrada por esta curva es al menos cuatro veces el área de la elipse $\Gamma$.`,
  },
  {
    codigo: 'OMMU-PR-2025-5',
    titulo: 'Cota de una integral usando la derivada',
    categoriaKey: 'ommu-pr-2025',
    año: '2025',
    tema: 'Análisis',
    tipo: 'OMMU Primera Ronda',
    ...estimarOMMU(5),
    enunciado: String.raw`Sea $f:[0,1]\rightarrow\mathbb{R}$ una función continua en $[0,1]$ y diferenciable en $(0,1)$ tal que existe $a\in(0,1]$ que satisface $\int_0^a f(x)dx=0$. Demuestra que:
$$\left| \int_0^1 f(x)dx \right| \leq \frac{1-a}{2}\sup_{0<x<1}|f'(x)|$$`,
  },

  // --- 2026 ---
  {
    codigo: 'OMMU-PR-2026-1',
    titulo: 'Concurrencia de rectas con pendiente recíproca',
    categoriaKey: 'ommu-pr-2026',
    año: '2026',
    tema: 'Geometría',
    tipo: 'OMMU Primera Ronda',
    ...estimarOMMU(1),
    enunciado: String.raw`Sea $ABC$ un triángulo en el plano cartesiano tal que ninguno de sus lados es paralelo a los ejes coordenados. Sean $L$, $M$ y $N$ los puntos medios de los lados $BC$, $CA$ y $AB$, respectivamente. Por cada punto medio, se traza una línea cuya pendiente es el recíproco de la pendiente del lado correspondiente. Demuestra que estas tres líneas son concurrentes.
Nota: El recíproco de $m$ es $1/m$.`,
  },
  {
    codigo: 'OMMU-PR-2026-2',
    titulo: 'Punto donde P′/P iguala una suma de recíprocos',
    categoriaKey: 'ommu-pr-2026',
    año: '2026',
    tema: 'Análisis',
    tipo: 'OMMU Primera Ronda',
    ...estimarOMMU(2),
    enunciado: String.raw`Sea $P(x)$ un polinomio con coeficientes reales que no tiene raíces en $(a,b)\subset\mathbb{R}$. Demuestra que existe $\alpha\in(a,b)$ tal que:
$$\frac{P'(\alpha)}{P(\alpha)}=\frac{1}{a-\alpha}+\frac{1}{b-\alpha}$$
Nota: Aquí $P'$ representa la derivada del polinomio.`,
  },
  {
    codigo: 'OMMU-PR-2026-3',
    titulo: 'Determinante de una matriz de senos',
    categoriaKey: 'ommu-pr-2026',
    año: '2026',
    tema: 'Álgebra Lineal',
    tipo: 'OMMU Primera Ronda',
    ...estimarOMMU(3),
    enunciado: String.raw`Calcula el determinante de la matriz $A$ de tamaño $2026\times 2026$ cuyas entradas están dadas por la expresión $A_{i,j}=\sin(2026i+j)$ donde $1\le i\le 2026$ y $0\le j\le 2025$.`,
  },
  {
    codigo: 'OMMU-PR-2026-4',
    titulo: 'Pares y tripletas que dan la identidad en un grupo',
    categoriaKey: 'ommu-pr-2026',
    año: '2026',
    tema: 'Álgebra',
    tipo: 'OMMU Primera Ronda',
    ...estimarOMMU(4),
    enunciado: String.raw`Sea $G$ un grupo finito de orden $2n$ con elemento identidad $e$. Considera $R$ y $B$ como dos subconjuntos disjuntos de $G$ tales que $G=R\cup B$ con $|R|=|B|=n$.
a) Demuestra que $|\{(x,y)\in R^2 \mid xy=e\}|=|\{(x,y)\in B^2 \mid xy=e\}|$.
b) Proporciona un contraejemplo que demuestre que el enunciado análogo para tripletas es falso; es decir, que en general $|\{(x,y,z)\in R^3 \mid xyz=e\}|\neq|\{(x,y,z)\in B^3 \mid xyz=e\}|$.
Nota: Un grupo es un conjunto $G$ con una operación asociativa $\cdot:G\times G\rightarrow G$, con identidad $e$ y con inversos.`,
  },
  {
    codigo: 'OMMU-PR-2026-5',
    titulo: 'Límite del valor esperado de la valuación p-ádica',
    categoriaKey: 'ommu-pr-2026',
    año: '2026',
    tema: 'Probabilidad',
    tipo: 'OMMU Primera Ronda',
    ...estimarOMMU(5),
    enunciado: String.raw`Sea $p$ un número primo fijo. Para cada entero positivo $n$, sea $X_n$ una variable aleatoria uniforme en el conjunto $\{1,2,\dots,n\}$. Definimos $V_p(m)$ como el exponente de $p$ en la factorización prima de $m$. Demuestra que el siguiente límite existe y encuentra su valor:
$$\lim_{n\rightarrow\infty}\mathbb{E}[V_p(X_n)]$$
Nota: Recuerda que para una variable aleatoria discreta $Y$ que toma valores enteros positivos, tenemos $\mathbb{E}(Y)=\sum_{k=1}^{\infty}k\cdot P(Y=k)$.`,
  },
]

// ===========================================================================
// OMMU — CONCURSO NACIONAL
// ===========================================================================

const ommuNacional = [
  // --- 2024 ---
  {
    codigo: 'OMMU-NAC-2024-1',
    titulo: 'La ecuación x⁴ = p + 9y⁴',
    categoriaKey: 'ommu-nac-2024',
    año: '2024',
    tema: 'Teoría de Números',
    tipo: 'OMMU Nacional',
    ...estimarOMMU(1),
    enunciado: String.raw`Sean $x, y, p$ enteros positivos que satisfacen la ecuación $x^4=p+9y^4$ donde $p$ es un número primo. Demuestra que $\frac{p^2-1}{3}$ es un cuadrado perfecto y un múltiplo de $16$.`,
  },
  {
    codigo: 'OMMU-NAC-2024-2',
    titulo: 'Un polinomio que lleva A a B',
    categoriaKey: 'ommu-nac-2024',
    año: '2024',
    tema: 'Álgebra Lineal',
    tipo: 'OMMU Nacional',
    ...estimarOMMU(2),
    enunciado: String.raw`Sean $A$ y $B$ dos matrices cuadradas con entradas complejas tales que $A+B=AB$, $A=A^*$ y $A$ tiene todos sus valores propios distintos. Demuestra que existe un polinomio $P$ con coeficientes complejos tal que $P(A)=B$.`,
  },
  {
    codigo: 'OMMU-NAC-2024-3',
    titulo: 'Valores cercanos de una función multiplicativa',
    categoriaKey: 'ommu-nac-2024',
    año: '2024',
    tema: 'Teoría de Números',
    tipo: 'OMMU Nacional',
    ...estimarOMMU(3),
    enunciado: String.raw`Considera una función multiplicativa $f$ de los enteros positivos al disco unitario centrado en el origen, es decir, $f:\mathbb{Z}^+\rightarrow D^2\subseteq\mathbb{C}$ tal que $f(mn)=f(m)f(n)$. Demuestra que para todo $\epsilon>0$ y todo entero $k>0$ existen $k$ enteros positivos distintos $a_1,a_2,\dots,a_k$ tales que $\operatorname{mcd}(a_1,a_2,\dots,a_k)=k$ y $d(f(a_i),f(a_j))<\epsilon$ para todos $i, j=1,\dots,k$.`,
  },
  {
    codigo: 'OMMU-NAC-2024-4',
    titulo: 'Límite de la raíz i-ésima de una entrada de Bⁱ',
    categoriaKey: 'ommu-nac-2024',
    año: '2024',
    tema: 'Álgebra Lineal',
    tipo: 'OMMU Nacional',
    ...estimarOMMU(4),
    enunciado: String.raw`Dado $b>0$ considera la siguiente matriz:
$$B=\begin{pmatrix}b&b^2\\ b^2&b^3\end{pmatrix}$$
Denota por $e_i$ la entrada superior izquierda de $B^i$. Demuestra que el siguiente límite existe y calcula su valor:
$$\lim_{i\rightarrow\infty}\sqrt[i]{e_i}$$`,
  },
  {
    codigo: 'OMMU-NAC-2024-5',
    titulo: 'Permutación que evita sumas cero',
    categoriaKey: 'ommu-nac-2024',
    año: '2024',
    tema: 'Combinatoria',
    tipo: 'OMMU Nacional',
    ...estimarOMMU(5),
    enunciado: String.raw`Considera dos sucesiones finitas de números reales $a_1,a_2,\dots,a_n$ y $b_1,b_2,\dots,b_n$. Sean $\alpha(x)=|\{i \mid a_i=x\}|$ y $\beta(x)=|\{i \mid b_i=-x\}|$. Demuestra que existe una permutación $\sigma\in S_n$ (el grupo simétrico de $n$ elementos) tal que $a_{\sigma(i)}+b_i\neq 0$ para todo $i=1,\dots,n$ si y solo si $\alpha(x)+\beta(x)\le n$ para todo $x\in\mathbb{R}$.`,
  },
  {
    codigo: 'OMMU-NAC-2024-6',
    titulo: 'Cota para (p²)″ en términos de (p′)²',
    categoriaKey: 'ommu-nac-2024',
    año: '2024',
    tema: 'Análisis',
    tipo: 'OMMU Nacional',
    ...estimarOMMU(6),
    enunciado: String.raw`Sea $p$ un polinomio mónico con todas sus raíces reales distintas. Demuestra que existe $K$ tal que $(p(x)^2)''\le K(p'(x))^2$.`,
  },

  // --- 2025 ---
  {
    codigo: 'OMMU-NAC-2025-1',
    titulo: 'Integral con simetría en 25 y 81',
    categoriaKey: 'ommu-nac-2025',
    año: '2025',
    tema: 'Análisis',
    tipo: 'OMMU Nacional',
    ...estimarOMMU(1),
    enunciado: String.raw`Encuentra el valor de la integral (Día 1):
$$\int_{25}^{81}\frac{\sin(x)}{x\left(\sin(x)+\sin\left(\frac{2025}{x}\right)\right)}dx$$`,
  },
  {
    codigo: 'OMMU-NAC-2025-2',
    titulo: 'Ventiladores cíclicos y botones de fila-columna',
    categoriaKey: 'ommu-nac-2025',
    año: '2025',
    tema: 'Combinatoria',
    tipo: 'OMMU Nacional',
    ...estimarOMMU(2),
    enunciado: String.raw`(Día 1) Considera una cuadrícula de $n\times n$ ventiladores, donde cada ventilador tiene $2025$ velocidades. La velocidad más baja corresponde al estado "apagado". Cada ventilador puede cambiar su velocidad a la siguiente más alta, y desde la velocidad máxima pasa al estado "apagado"; es decir, el cambio de velocidades ocurre de forma cíclica. Hay un control remoto con botones también dispuestos en una cuadrícula de $n\times n$. Cuando se presiona un botón, todos los ventiladores en la misma fila y columna que ese botón aumentan su velocidad en uno (siguiendo el ciclo descrito). Determina la cantidad de valores $n\le 2025$ para los cuales es posible pasar del estado donde todos los ventiladores están apagados a un estado donde todos están encendidos a la misma velocidad (para cada una de las $2025$ velocidades posibles).`,
  },
  {
    codigo: 'OMMU-NAC-2025-3',
    titulo: 'Grupo de matrices simétricas con valores propios ±1',
    categoriaKey: 'ommu-nac-2025',
    año: '2025',
    tema: 'Álgebra Lineal',
    tipo: 'OMMU Nacional',
    ...estimarOMMU(3),
    enunciado: String.raw`(Día 1) Sea $G$ un grupo de matrices simétricas de $n\times n$ con entradas reales. Supón que para todo elemento en $G$, sus valores propios son $1$ o $-1$. Demuestra que el tamaño de $G$ es $2^k$ para algún $k\le n$.`,
  },
  {
    codigo: 'OMMU-NAC-2025-4',
    titulo: 'Hexágono regular a partir de triángulos equiláteros',
    categoriaKey: 'ommu-nac-2025',
    año: '2025',
    tema: 'Geometría',
    tipo: 'OMMU Nacional',
    ...estimarOMMU(4),
    enunciado: String.raw`(Día 2) Se construyen triángulos equiláteros externamente sobre los lados de un hexágono que tiene un centro de simetría. Los vértices de estos triángulos que no pertenecen al hexágono inicial forman un nuevo hexágono. Demuestra que los puntos medios de los lados de este nuevo hexágono son vértices de un hexágono regular.`,
  },
  {
    codigo: 'OMMU-NAC-2025-5',
    titulo: 'Camino hamiltoniano de suma cero',
    categoriaKey: 'ommu-nac-2025',
    año: '2025',
    tema: 'Combinatoria',
    tipo: 'OMMU Nacional',
    ...estimarOMMU(5),
    enunciado: String.raw`(Día 2) Cada arista de una gráfica completa con $101$ vértices está etiquetada con $1$ o $-1$. Se sabe que el valor absoluto de la suma de los números asignados a las aristas es menor que $150$. Demuestra que la gráfica contiene un camino que visita todos los vértices exactamente una vez, tal que la suma de los valores de dicho camino es cero.`,
  },
  {
    codigo: 'OMMU-NAC-2025-6',
    titulo: 'Límite de una sucesión recursiva entre √n',
    categoriaKey: 'ommu-nac-2025',
    año: '2025',
    tema: 'Análisis',
    tipo: 'OMMU Nacional',
    ...estimarOMMU(6),
    enunciado: String.raw`(Día 2) Considera la sucesión $(a_n)$ definida por la relación:
$$a_n=\frac{a_{n-1}+\sqrt{a_{n-1}^2+4}}{2}, \quad a_1=1$$
Demuestra que $b_n=\frac{a_n}{\sqrt{n}}$ converge y calcula su valor en el límite cuando $n\rightarrow\infty$.`,
  },

  // --- 2026 ---
  {
    codigo: 'OMMU-NAC-2026-1',
    titulo: 'Longitud mínima de un ciclo con relación tipo trenza',
    categoriaKey: 'ommu-nac-2026',
    año: '2026',
    tema: 'Álgebra',
    tipo: 'OMMU Nacional',
    ...estimarOMMU(1),
    enunciado: String.raw`(Día 1) Sean $\alpha$ y $\beta$ dos permutaciones de $n$ elementos, con $n>3$, tales que:
a) Para cualquier $x$, si $\alpha(x)=x$ entonces $\beta(x)\neq x$, es decir, $\alpha$ y $\beta$ no tienen puntos fijos en común.
b) $\alpha$ y $\beta$ satisfacen la siguiente relación: $\alpha\cdot\beta^{-1}\cdot\alpha^{-1}\cdot\beta\cdot\alpha\cdot\beta^{-1}\cdot\alpha\cdot\beta\cdot\alpha^{-1}\cdot\beta^{-1}=1$.
c) $\alpha$ consiste en un solo ciclo de longitud $k$ con $k<n$.
Demuestra que $k\ge 2n/3$.`,
  },
  {
    codigo: 'OMMU-NAC-2026-2',
    titulo: 'Desigualdad entre grados y una función en los vértices',
    categoriaKey: 'ommu-nac-2026',
    año: '2026',
    tema: 'Combinatoria',
    tipo: 'OMMU Nacional',
    ...estimarOMMU(2),
    enunciado: String.raw`(Día 1) Sea $G=(V,E)$ una gráfica conexa, donde $V$ es el conjunto de vértices y $E$ es el conjunto de aristas. Sea $d_i$ el grado del vértice $i\in V$. Sea también $f:V\rightarrow\mathbb{R}^+$ una función que satisface $f(i)f(j)\ge 1$, para todo $i\sim j$, donde $i\sim j$ significa que los vértices $i$ y $j$ son adyacentes.
a) Demuestra que $\sum_{i\in V}f(i)\ge\sum_{e=\{i,j\}}\frac{2}{\sqrt{d_id_j}}$.
b) Determina todas las gráficas $G$ y funciones $f$ para las cuales se alcanza la igualdad.`,
  },
  {
    codigo: 'OMMU-NAC-2026-3',
    titulo: 'Grado mínimo de un polinomio separador',
    categoriaKey: 'ommu-nac-2026',
    año: '2026',
    tema: 'Geometría',
    tipo: 'OMMU Nacional',
    ...estimarOMMU(3),
    enunciado: String.raw`(Día 1) En el plano, hay $2025$ puntos azules y $2026$ puntos rojos en posición general. Determina el menor entero $d$ con la siguiente propiedad: para cualquier distribución de estos puntos, existe un polinomio $P(x,y)\in\mathbb{R}[x,y]$ de grado a lo más $d$ tal que $P(R)<0$ para todo punto rojo $R$, y $P(A)>0$ para todo punto azul $A$.`,
  },
  {
    codigo: 'OMMU-NAC-2026-4',
    titulo: 'Determinante y valores z_i distintos',
    categoriaKey: 'ommu-nac-2026',
    año: '2026',
    tema: 'Álgebra Lineal',
    tipo: 'OMMU Nacional',
    ...estimarOMMU(4),
    enunciado: String.raw`(Día 2) Sean $z_1,z_2,\dots, z_{1013}$ números complejos. Considera la matriz $A$ de tamaño $2026\times 2026$. Para cada $i=1,\dots, 1013$, la fila $2i-1$ de la matriz está dada por: $(1,z_i,z_i^2,\dots,z_i^{2025})$ y la fila $2i$ está dada por: $(0,1,2z_i,3z_i^2,\dots,2025z_i^{2024})$. Demuestra que $\det(A)$ es distinto de cero si y solo si todos los $z_i$ son distintos.`,
  },
  {
    codigo: 'OMMU-NAC-2026-5',
    titulo: 'Asíntotas de la raíz máxima de q_d',
    categoriaKey: 'ommu-nac-2026',
    año: '2026',
    tema: 'Análisis',
    tipo: 'OMMU Nacional',
    ...estimarOMMU(5),
    enunciado: String.raw`(Día 2) Sea $p(x)$ un polinomio mónico de grado $n$, con $n$ par, que tiene $n$ raíces reales positivas distintas. Para cada $d>0$, define $q_d(x)=\frac{1}{d}x^{n+1}-p(x)$, y sea $\lambda_{\max}(d)$ la mayor raíz real de $q_d$.
a) Demuestra que existen números reales $\alpha$ y $L\neq 0$ tales que $\lim_{d\rightarrow\infty}\frac{\lambda_{\max}(d)}{d^\alpha}=L$, y determina $\alpha$ y $L$.
b) Demuestra que existen números reales $\beta$ y $M\neq 0$ tales que $\lim_{d\rightarrow 0^+}\frac{\lambda_{\max}(d)}{d^\beta}=M$, y determina $\beta$ y $M$.`,
  },
  {
    codigo: 'OMMU-NAC-2026-6',
    titulo: 'Movimientos mínimos para vaciar fichas módulo 2026',
    categoriaKey: 'ommu-nac-2026',
    año: '2026',
    tema: 'Combinatoria',
    tipo: 'OMMU Nacional',
    ...estimarOMMU(6),
    enunciado: String.raw`(Día 2) Sea $N$ un múltiplo de $2025^2-1$. Supón que los números $1, 2, \dots, 2026$ tienen $N$ fichas cada uno. Un movimiento consiste en remover fichas de los números $x_1,x_2,\dots,x_n$ (no necesariamente distintos) tales que:
a) $x_1+x_2+\dots+x_n\equiv 0 \pmod{2026}$, y
b) $x_{i_1}+x_{i_2}+\dots+x_{i_r}\not\equiv 0 \pmod{2026}$ para cualquier subconjunto propio $\{i_1,i_2,\dots,i_r\}\subsetneq\{1,2,\dots,n\}$.
Encuentra el mínimo número de movimientos (en términos de $N$) para remover todas las fichas.`,
  },
]

// ===========================================================================
// PUTNAM
// ===========================================================================

function putnam(codigo, año, seccion, posicion, titulo, tema, enunciado, solucion) {
  return {
    codigo,
    titulo,
    categoriaKey: `putnam-${año}`,
    año: String(año),
    tema,
    tipo: 'Putnam',
    ...estimarPutnam(posicion),
    enunciado,
    solucion,
  }
}

// putnam1985..putnam2020: importados en 2026 desde un dataset público de
// problemas Putnam (con enunciado y solución oficial en inglés) y traducidos
// al español aquí. A diferencia de putnam2021 en adelante (traducidos a mano
// desde cero), estos ya traían una solución oficial, así que también se
// guarda en el 8vo argumento — ver el campo `solucion` en Problem.js.
const putnam1985 = [
  putnam('PUTNAM-1985-A1', 1985, 'A', 1, 'Ternas ordenadas de conjuntos que cubren {1,...,10}', 'Combinatoria',
    String.raw`Determina, con demostración, el número de ternas ordenadas $(A_1, A_2, A_3)$ de conjuntos que tienen la propiedad de que (i) $A_1 \cup A_2 \cup A_3 = \{1,2,3,4,5,6,7,8,9,10\}$, y (ii) $A_1 \cap A_2 \cap A_3 = \emptyset$. Expresa tu respuesta en la forma $2^a 3^b 5^c 7^d$, donde $a,b,c,d$ son enteros no negativos.`,
    String.raw`Cada entero $i$ con $1 \leq i \leq 10$ cae en una de seis clases mutuamente disjuntas: $A_1 \cap \overline{A_2} \cap \overline{A_3}, \overline{A_1} \cap A_2 \cap \overline{A_3}, \overline{A_1} \cap \overline{A_2} \cap A_3, A_1 \cap A_2 \cap \overline{A_3}, A_1 \cap \overline{A_2} \cap A_3, \text{y } \overline{A_1} \cap A_2 \cap A_3$; por lo tanto hay $6^{10} = \boxed{2^{10}3^{10}}$ ternas ordenadas distintas.`),
  putnam('PUTNAM-1985-A2', 1985, 'A', 2, 'Razón máxima de áreas de rectángulos inscritos en un triángulo', 'Geometría',
    String.raw`Sea $T$ un triángulo acutángulo. Inscribe un rectángulo $R$ en $T$ con un lado sobre un lado de $T$. Luego inscribe un rectángulo $S$ en el triángulo formado por el lado de $R$ opuesto al lado que está sobre la frontera de $T$, y los otros dos lados de $T$, con un lado sobre el lado de $R$. Para cualquier polígono $X$, sea $A(X)$ el área de $X$. Encuentra el valor máximo, o demuestra que no existe máximo, de $\frac{A(R)+A(S)}{A(T)}$, donde $T$ recorre todos los triángulos y $R,S$ recorren todos los rectángulos como se describió.`,
    String.raw`Etiqueta las longitudes como en la figura. Entonces $$ \frac{A(R) + A(S)}{A(T)} = \frac{ay + bz}{hx/2}, $$ donde $h = a + b + c$ es la altura de $T$. Por triángulos semejantes, $$ \frac{x}{h} = \frac{y}{b+c} = \frac{z}{c}, $$ así que $$ \frac{A(R) + A(S)}{A(T)} = \frac{(b+c)x}{h} + \frac{cx}{h} = \frac{2}{h^2}(ab + ac + bc). $$ Necesitamos maximizar $ab + ac + bc$ sujeto a $a + b + c = h$. Una forma de hacerlo es fijar primero $a$, de modo que $b + c = h - a$. Entonces $$ ab + ac + bc = a(h - a) + bc, $$ y $bc$ se maximiza cuando $b = c$. Ahora queremos maximizar $2ab + b^2$ sujeto a $a + 2b = h$, lo cual es un problema directo de cálculo que da $a = b = c = h/3$. Por lo tanto la razón máxima es $\boxed{2/3}$ (independiente de $T$).`),
  putnam('PUTNAM-1985-A3', 1985, 'A', 3, 'Límite de una recursión cuadrática que da e^d − 1', 'Análisis',
    String.raw`Sea $d$ un número real. Para cada entero $m \geq 0$, define una sucesión $\{a_m(j)\}$, $j=0,1,2,\dots$ mediante la condición $$ a_m(0) = d/2^m, \qquad a_m(j+1) = (a_m(j))^2 + 2a_m(j), \quad j \geq 0. $$ Evalúa $\lim_{n \to \infty} a_n(n)$.`,
    String.raw`Tenemos $a_n(j+1) + 1 = (a_n(j) + 1)^2$, y por lo tanto, por inducción, $$ a_n(j) + 1 = (a_n(0) + 1)^{2^j}. $$ Por lo tanto, $$ \lim_{n \to \infty} a_n(n) = \lim_{n \to \infty} \left( 1 + \frac{d}{2^n} \right)^{2^n} - 1 = \boxed{e^d - 1}. $$`),
  putnam('PUTNAM-1985-A4', 1985, 'A', 4, 'Últimos dos dígitos de una torre de potencias de 3', 'Teoría de Números',
    String.raw`Define una sucesión $\{a_i\}$ mediante $a_1=3$ y $a_{i+1}=3^{a_i}$ para $i\geq 1$. ¿Qué enteros entre 00 y 99 inclusive ocurren como los últimos dos dígitos en la expansión decimal de infinitos $a_i$?`,
    String.raw`Queremos considerar $a_i \equiv 3^{a_{i-1}} \pmod{100}$. Recuerda que $a^{\phi(n)} \equiv 1 \pmod{n}$ siempre que $a$ sea primo relativo con $n$ ($\phi$ es la función phi de Euler). Por lo tanto, como $\phi(100) = 40$, podemos hallar $a_i \pmod{100}$ conociendo $a_{i-1} \pmod{40}$. De manera similar, podemos hallar $a_{i-1} \pmod{40}$ hallando $a_{i-2} \pmod{16}$, porque $a_{i-1} = 3^{a_{i-2}}$ y $\phi(40) = 16$. De nuevo, $a_{i-2} = 3^{a_{i-3}}$ y $\phi(16) = 8$, y por lo tanto $$ a_{i-3} \equiv 3^{a_{i-4}} \equiv 3^{\text{entero impar}} \equiv 3 \pmod{8}. $$ De esto se sigue que $a_{i-2} \equiv 3^3 \equiv 11 \pmod{16}$, y de esto, $$ a_{i-1} \equiv 3^{11} \equiv 27 \pmod{40}, $$ y finalmente, $$ a_i \equiv 3^{27} \equiv 87 \pmod{100}. $$ Todo esto es válido para todo $i \geq 4$. Por lo tanto, $\boxed{87}$ es el único entero que ocurre como los últimos dos dígitos en las expansiones decimales de infinitos $a_i$.`),
  putnam('PUTNAM-1985-A5', 1985, 'A', 5, 'Valores de m para los que la integral de cosenos no se anula', 'Teoría de Números',
    String.raw`Sea $I_m = \int_0^{2\pi} \cos(x)\cos(2x)\cdots \cos(mx)\,dx$. ¿Para cuáles enteros $m$, $1 \leq m \leq 10$, se tiene $I_m \neq 0$?`,
    String.raw`Escribe $$ I_m = \int_0^{2\pi} \prod_{k=1}^m \left( \frac{e^{ikx} + e^{-ikx}}{2} \right) dx = \sum_{\epsilon_k = \pm 1} \frac{1}{2^m} \int_0^{2\pi} e^{i(\epsilon_1 + 2\epsilon_2 + \cdots + m\epsilon_m)x} dx. $$ La integral $\int_0^{2\pi} e^{ilx} dx$ es cero si $l$ es un entero distinto de cero, y es $2\pi$ en caso contrario. Así, $I_m \geq 0$, y $I_m \neq 0$ si y solo si $0$ se puede escribir en la forma $\epsilon_1 + 2\epsilon_2 + \cdots + m\epsilon_m$ para algunos $\epsilon_1, \epsilon_2, \dots, \epsilon_m \in \{-1, 1\}$. Para una suma $\epsilon_1 + 2\epsilon_2 + \cdots + m\epsilon_m$, sea $r$ la suma de los términos positivos y $s$ la suma de los valores absolutos de los términos negativos. Entonces $r - s = m(m + 1)/2$. Una condición necesaria para $r = s$ es que $m(m + 1)/2$ sea par, es decir, que $m \equiv 0$ o $3 \pmod{4}$. Así, los únicos candidatos que satisfacen esta condición con $1 \leq m \leq 10$ son $m = 3, 4, 7$ y $8$. Se verifica que $I_m \neq 0$ para cada uno: $1 + 2 - 3 = 0$ (para $m=3$), $1 - 2 - 3 + 4 = 0$ (para $m=4$), $1+2-3+4-5-6+7=0$ (para $m=7$), y $(1 - 2 - 3 + 4) + (5 - 6 - 7 + 8) = 0$ (para $m=8$). Por lo tanto, $I_m \neq 0$ exactamente para $\boxed{m \in \{3,4,7,8\}}$.`),
  putnam('PUTNAM-1985-A6', 1985, 'A', 6, 'Polinomio g con igual suma de cuadrados de coeficientes que F', 'Álgebra',
    String.raw`Si $p(x)= a_0 + a_1 x + \cdots + a_m x^m$ es un polinomio con coeficientes reales $a_i$, define $$ \Gamma(p(x)) = a_0^2 + a_1^2 + \cdots + a_m^2. $$ Sea $F(x) = 3x^2+7x+2$. Encuentra, con demostración, un polinomio $g(x)$ con coeficientes reales tal que (i) $g(0)=1$, y (ii) $\Gamma(F(x)^n) = \Gamma(g(x)^n)$ para todo entero $n \geq 1$.`,
    String.raw`Observa que $\Gamma(p(x)) = \int_0^1 |p(e(\theta))|^2 d\theta$, donde $e(\theta) = e^{2\pi i \theta}$. Por lo tanto, $$ \Gamma(F(x)^n) = \int_0^1 |F(e(\theta))|^{2n} d\theta = \int_0^1 |3e(\theta) + 1|^{2n}|e(\theta) + 2|^{2n} d\theta. $$ Pero $$ |e(\theta) + 2| = |e(\theta)| \cdot |1 + 2e^{-\theta}| = |1 + 2e^{-\theta}| = \sqrt{1 + 4\cos^2(\theta)}. $$ Por lo tanto, $$ \Gamma(F(x)^n) = \int_0^1 |3e(\theta) + 1|^{2n} |1 + 2e(\theta)|^{2n} d\theta = \Gamma(g(x)^n), $$ donde $g(x) = \boxed{6x^2 + 5x + 1}$.`),
  putnam('PUTNAM-1985-B1', 1985, 'B', 1, 'Mínimo número de coeficientes no nulos de un quíntico con raíces enteras distintas', 'Teoría de Números',
    String.raw`Sea $k$ el menor entero positivo para el cual existen enteros distintos $m_1, m_2, m_3, m_4, m_5$ tales que el polinomio $$ p(x) = (x-m_1)(x-m_2)(x-m_3)(x-m_4)(x-m_5) $$ tiene exactamente $k$ coeficientes no nulos. Encuentra, con demostración, un conjunto de enteros $m_1, m_2, m_3, m_4, m_5$ para el cual se alcanza este mínimo $k$.`,
    String.raw`Claramente $k > 1$; de lo contrario $p(x) = x^5$ y $m_1, \ldots, m_5$ no serían distintos. Supón que $k = 2$, de modo que $p(x) = x^5 + ax^j$ con $0 \leq j \leq 4$. No podemos tener $j \geq 2$, ya que entonces al menos dos de las $m_i$ serían iguales a $0$. Por lo tanto $p(x) = x^5 + a$ o $p(x) = x(x^4 + a)$ con $a \neq 0$. Pero $x^5 + a$ y $x^4 + a$ tienen a lo más dos raíces reales, así que esto es imposible con cinco raíces distintas; por lo tanto $k > 2$. Toma $m_1 = -2$, $m_2 = -1$, $m_3 = 0$, $m_4 = 1$, $m_5 = 2$. Entonces $$ p(x) = x(x^2 - 1)(x^2 - 4) = x^5 - 5x^3 + 4x. $$ Por lo tanto $k = 3$, y este valor se alcanza con estos $m_i$. Así, $\boxed{k=3}$.`),
  putnam('PUTNAM-1985-B2', 1985, 'B', 2, 'Factorización de f_100(1) para una familia de polinomios recursivos', 'Teoría de Números',
    String.raw`Define polinomios $f_n(x)$ para $n \geq 0$ mediante $f_0(x)=1$, $f_n(0)=0$ para $n \geq 1$, y $$ \frac{d}{dx} f_{n+1}(x) = (n+1)f_n(x+1) $$ para $n \geq 0$. Encuentra, con demostración, la factorización explícita de $f_{100}(1)$ en potencias de primos distintos.`,
    String.raw`Al examinar los primeros casos se conjetura que $f_n(x) = x(x+n)^{n-1}$. Claramente esta conjetura satisface $f_0(x) = 1$ y $f_n(0) = 0$ para $n \geq 1$. Ahora $$ f'_{n+1}(x) = (x + n + 1)^n + nx(x + n + 1)^{n-1} = (n+1)(x+1)(x+n+1)^{n-1} = (n+1)f_n(x+1). $$ Por lo tanto $f_n(x) = x(x + n)^{n-1}$ como se conjeturó. Entonces, $f_{100}(1) = \boxed{101^{99}}$.`),
  putnam('PUTNAM-1985-B4', 1985, 'B', 4, 'Probabilidad de que un rectángulo aleatorio quede dentro del círculo', 'Geometría',
    String.raw`Sea $C$ el círculo unitario $x^2+y^2=1$. Se elige un punto $p$ al azar sobre la circunferencia $C$ y otro punto $q$ al azar del interior de $C$ (estos puntos se eligen de forma independiente y uniforme sobre sus dominios). Sea $R$ el rectángulo con lados paralelos a los ejes $x$ y $y$ con diagonal $pq$. ¿Cuál es la probabilidad de que ningún punto de $R$ quede fuera de $C$?`,
    String.raw`Sea $p = (\cos \theta, \sin \theta)$ y $q = (x, y)$. Los otros dos vértices de $R$ son $(\cos \theta, y)$ y $(x, \sin \theta)$, así que ningún punto de $R$ queda fuera de $C$ si y solo si $\cos^2 \theta + y^2 \leq 1$ y $\sin^2 \theta + x^2 \leq 1$, o equivalentemente, $|y| \leq |\sin \theta|$ y $|x| \leq |\cos \theta|$. Observa que estas condiciones implican que $(x, y)$ está dentro del círculo, así que, para cualquier $\theta$, la probabilidad de que $(x, y)$ satisfaga estas condiciones es $$ \frac{2|\sin \theta| \cdot 2|\cos \theta|}{\pi} = \frac{2}{\pi} |\sin 2\theta|, $$ y la probabilidad total es $$ \frac{1}{2\pi} \int_0^{2\pi} \frac{2}{\pi}|\sin 2\theta|\, d\theta = \frac{1}{2} \cdot \frac{2}{\pi} \cdot 4 = \boxed{\frac{4}{\pi^2}}. $$`),
  putnam('PUTNAM-1985-B5', 1985, 'B', 5, 'Integral tipo Bessel evaluada mediante un truco de cambio de variable', 'Análisis',
    String.raw`Evalúa $\int_0^\infty t^{-1/2}e^{-1985(t+t^{-1})}\,dt$. Puedes suponer que $\int_{-\infty}^\infty e^{-x^2}\,dx = \sqrt{\pi}$.`,
    String.raw`Sea $I(x) = \int_0^\infty t^{-1/2}e^{-at-x/t}\, dt$, donde $a = 1985$. Entonces $$ I'(x) = -\int_0^\infty t^{-3/2}e^{-at-x/t}\, dt. $$ Haz la sustitución $u = 1/t$, y la última ecuación se vuelve $$ I'(x) = -\int_0^\infty u^{-1/2}e^{-au-xu}\, du. $$ Ahora sea $w = \frac{x}{a}u$, y la ecuación se convierte en $$ I'(x) = -\left(\frac{a}{x}\right)^{1/2} \int_0^\infty w^{-1/2}e^{-xw-aw}\, dw = -\left(\frac{a}{x}\right)^{1/2} I(x). $$ Por lo tanto, $\log I(x) = -2(ax)^{1/2} + C$, o equivalentemente, $I(x) = ke^{-2(ax)^{1/2}}$. Además, $$ k = I(0) = \int_0^\infty t^{-1/2}e^{-at}\, dt = \int_0^\infty 2e^{-at^2}\, dt = \frac{\sqrt{\pi}}{\sqrt{a}}. $$ Esto da $$ I(a) = \boxed{\frac{\sqrt{\pi}}{\sqrt{1985}}e^{-3970}}. $$ (Nota: esta integral es esencialmente la función de Bessel modificada $K_{1/2}(3970)$.)`),
]

const putnam1986 = [
  putnam('PUTNAM-1986-A1', 1986, 'A', 1, 'Máximo de x³−3x sobre la región donde x⁴+36≤13x²', 'Álgebra',
    String.raw`Encuentra, con explicación, el valor máximo de $f(x)=x^3-3x$ sobre el conjunto de todos los números reales $x$ que satisfacen $x^4+36\leq 13x^2$.`,
    String.raw`La condición $x^4 + 36 \leq 13x^2$ es equivalente a $$ (x - 3)(x - 2)(x + 2)(x + 3) \leq 0. $$ Esto se satisface si y solo si $x$ está en el intervalo cerrado $[-3, -2]$ o en el intervalo cerrado $[2, 3]$. La función $f$ es creciente en estos intervalos porque, para tales $x$, $f'(x) = 3(x^2 - 1) > 0$. Se sigue que el valor máximo de $f$ sobre este dominio es $\max \{f(-2), f(3)\} = \boxed{18}$.`),
  putnam('PUTNAM-1986-A2', 1986, 'A', 2, 'Dígito de las unidades de un piso de potencias de 10', 'Teoría de Números',
    String.raw`¿Cuál es el dígito de las unidades (el de más a la derecha) de $$ \left\lfloor \frac{10^{20000}}{10^{100}+3}\right\rfloor ? $$`,
    String.raw`El mayor entero es $$ I = \frac{10^{20000} - 3^{200}}{10^{100} + 3} $$ ya que el residuo es $$ \frac{3^{200}}{10^{100} + 3} < 1. $$ Tenemos $$ I \equiv \frac{-3^{200}}{3} \pmod{10} \equiv -3^{199} \pmod{10} \equiv -3^3(3^4)^{49} \pmod{10} \equiv -27 \pmod{10} \equiv 3 \pmod{10}. $$ El último dígito es $\boxed{3}$.`),
  putnam('PUTNAM-1986-A3', 1986, 'A', 3, 'Suma de arcocotangentes que telescopa a π/2', 'Trigonometría',
    String.raw`Evalúa $\sum_{n=0}^\infty \mathrm{Arccot}(n^2+n+1)$, donde $\mathrm{Arccot}\,t$ para $t \geq 0$ denota el número $\theta$ en el intervalo $0 < \theta \leq \pi/2$ tal que $\cot \theta = t$.`,
    String.raw`Usando $$ \cot(\alpha - \beta) = \frac{\cot \alpha \cot \beta + 1}{\cot \beta - \cot \alpha}, $$ se observa que $\mathrm{Arccot}(1 + n + n^2) = \mathrm{Arccot} \, n - \mathrm{Arccot} (n + 1)$. Entonces la serie telescopa a $$ \lim_{n \to \infty} (\mathrm{Arccot} \, 0 - \mathrm{Arccot} (n + 1)) = \boxed{\frac{\pi}{2}}. $$`),
  putnam('PUTNAM-1986-A4', 1986, 'A', 4, 'Fórmula para matrices con suma constante en transversales', 'Combinatoria',
    String.raw`Una transversal de una matriz $A$ de $n\times n$ consiste de $n$ entradas de $A$, no dos en la misma fila o columna. Sea $f(n)$ el número de matrices $A$ de $n \times n$ que satisfacen las siguientes dos condiciones: (a) cada entrada $\alpha_{i,j}$ de $A$ está en el conjunto $\{-1,0,1\}$, y (b) la suma de las $n$ entradas de una transversal es la misma para todas las transversales de $A$. Un ejemplo de tal matriz $A$ es $$ A = \left( \begin{array}{ccc} -1 & 0 & -1 \\ 0 & 1 & 0 \\ 0 & 1 & 0 \end{array} \right). $$ Determina, con demostración, una fórmula para $f(n)$ de la forma $$ f(n) = a_1 b_1^n + a_2 b_2^n + a_3 b_3^n + a_4, $$ donde las $a_i$ y $b_i$ son números racionales.`,
    String.raw`Primero se demuestra un lema: si una matriz $n \times n$ $(\alpha_{ij})$ satisface (b), entonces existen números únicos $c_1 = 0, c_2, \ldots, c_n, d_1, d_2, \ldots, d_n$ tales que $\alpha_{ij} = c_i + d_j$, y recíprocamente cualquier elección de esos $c_i$ y $d_j$ produce una única matriz que satisface (b). En efecto, si $\alpha_{ij} = c_i + d_j$ entonces toda transversal de $A$ suma $\sum_{i=1}^n c_i + \sum_{j=1}^n d_j$, así que (b) se cumple; y si $(\alpha_{ij})$ satisface (b), definiendo $d_j = \alpha_{1j} - \alpha_{11}$ y $c_i = \alpha_{i1} - \alpha_{11}$ se obtiene $\alpha_{ij} = c_i + d_j$ para todo $i,j$, con unicidad forzada por $c_1 = 0$. Por lo tanto, $f(n)$ es igual al número de $2n$-tuplas $(c_1 = 0, c_2, \ldots, c_n, d_1, \ldots, d_n)$ para las cuales $c_i + d_j \in \{0, \pm 1\}$ para todo $i,j$. Separando las posibilidades según qué valores distintos toman los $c_i$ y los $d_j$ compatibles con ellos, y sumando el conteo de cada caso, se obtiene $$ f(n) = \boxed{4^n + 2 \cdot 3^n - 4 \cdot 2^n + 1}. $$`),
  putnam('PUTNAM-1986-B1', 1986, 'B', 1, 'Altura h para que rectángulo y triángulo inscritos tengan igual área', 'Geometría',
    String.raw`Inscribe un rectángulo de base $b$ y altura $h$ en un círculo de radio uno, e inscribe un triángulo isósceles en la región del círculo cortada por una base del rectángulo (con ese lado como base del triángulo). ¿Para qué valor de $h$ el rectángulo y el triángulo tienen la misma área?`,
    String.raw`La altura del triángulo es $\frac{1}{2}(2-h)$. Áreas iguales significa $$ h \cdot b = \frac{1}{2} b \cdot \frac{1}{2}(2-h), $$ que tras simplificar da $h = \frac{1}{4}(2-h)$, así que $h = \boxed{\frac{2}{5}}$.`),
  putnam('PUTNAM-1986-B2', 1986, 'B', 2, 'Triples finitos (x−y, y−z, z−x) de un sistema complejo', 'Números Complejos',
    String.raw`Demuestra que existe solo un número finito de posibilidades para la terna ordenada $T=(x-y,y-z,z-x)$, donde $x,y,z$ son números complejos que satisfacen simultáneamente las ecuaciones $$ x(x-1)+2yz = y(y-1)+2zx = z(z-1)+2xy, $$ y enumera todas esas ternas $T$.`,
    String.raw`El sistema es equivalente a $$ 0 = (x-y)(x+y-1-2z) = (y-z)(y+z-1-2x) = (z-x)(z+x-1-2y). $$ Si no hay dos de $x$, $y$, $z$ iguales entre sí, entonces $$ x+y-1-2z = y+z-1-2x = z+x-1-2y = 0. $$ Sumando estas ecuaciones se obtiene la contradicción $-3 = 0$. Por lo tanto al menos dos de $x$, $y$, $z$ son iguales. Si $x = y$ y $y \neq z$, entonces $z = 2x+1-y = x+1$, y en este caso $x-y = 0$, $y-z = -1$ y $z-x = 1$. Un resultado análogo se obtiene cuando $y = z$ y $z \neq x$, y cuando $z = x$ y $x \neq y$. Así, las únicas posibilidades para $(x-y, y-z, z-x)$ son $(0,0,0)$, $(0,-1,1)$, $(1,0,-1)$ y $(-1,1,0)$; se verifica fácilmente que cada una de ellas ocurre.`),
]

const putnam1987 = [
  putnam('PUTNAM-1987-A2', 1987, 'A', 2, 'Dígitos de m para el 10^1987-ésimo dígito de la secuencia de enteros', 'Teoría de Números',
    String.raw`La secuencia de dígitos $$ 1,2,3,4,5,6,7,8,9,1,0,1,1,1,2,1,3,\dots $$ se obtiene escribiendo los enteros positivos en orden. Si el dígito en la posición $10^n$ de esta secuencia ocurre en la parte de la secuencia donde se colocan los números de $m$ dígitos, define $f(n)$ como $m$. Por ejemplo, $f(2)=2$ porque el dígito 100 entra en la secuencia con la colocación del entero de dos dígitos 55. Encuentra, con demostración, $f(1987)$.`,
    String.raw`Los números de $r$ dígitos van de $10^{r-1}$ a $10^r - 1$, así que hay $10^r - 10^{r-1}$ de ellos. Por lo tanto, el número total de dígitos en números con a lo más $r$ dígitos es $$ g(r) = r10^r - \frac{10^r - 1}{9} $$ para $r \geq 1$. Pero $0 < \frac{10^r - 1}{9} < 10^r$, así que $(r-1)10^r < g(r) < r10^r$. Por lo tanto, $g(1983) < 1983 \cdot 10^{1983} < 10^4 \cdot 10^{1983} = 10^{1987}$, y $g(1984) > 1983 \cdot 10^{1984} > 10^3 \cdot 10^{1984} = 10^{1987}$. Se sigue que $f(1987) = \boxed{1984}$.`),
  putnam('PUTNAM-1987-A4', 1987, 'A', 4, 'Constante |C−A| a partir de una forma cuadrática homogénea', 'Álgebra',
    String.raw`Sea $P$ un polinomio con coeficientes reales en tres variables, y sea $F$ una función de dos variables tal que $$ P(ux, uy, uz) = u^2 F(y-x,z-x) \quad \text{para todos los reales } x,y,z,u, $$ y tal que $P(1,0,0)=4$, $P(0,1,0)=5$, y $P(0,0,1)=6$. Sean también $A,B,C$ números complejos con $P(A,B,C)=0$ y $|B-A|=10$. Encuentra $|C-A|$.`,
    String.raw`Tomando $u = 1$ y $x = 0$, tenemos que $F(y,z) = P(0,y,z)$ es un polinomio. Como $F(uy,uz) = P(0,uy,uz) = u^2 F(y,z)$, $F$ es homogénea de grado 2. Ahora, $P(x,y,z) = F(y-x,z-x)$ implica que $$ P(x,y,z) = a(y-x)^2 + b(y-x)(z-x) + c(z-x)^2 $$ con $a,b,c$ reales. Entonces $4 = P(1,0,0) = a + b + c$, $5 = P(0,1,0) = a$, y $6 = P(0,0,1) = c$. Se sigue que $4 = a + b + c = 5 + b + 6$, así que $b = -7$. Para los números complejos $A,B,C$ de la hipótesis, tenemos $5(B-A)^2 - 7(B-A)(C-A) + 6(C-A)^2 = 0$. Sea $m = (C-A)/(B-A)$. Entonces $5 - 7m + 6m^2 = 0$. Las raíces de $6m^2 - 7m + 5 = 0$ son complejas, así que $|m| = \sqrt{5/6}$. Por lo tanto, $|C-A| = \sqrt{5/6}\, |B-A| = \boxed{\frac{5}{3}\sqrt{30}}$.`),
  putnam('PUTNAM-1987-A6', 1987, 'A', 6, 'Convergencia de una serie ponderada por ceros en base 3', 'Teoría de Números',
    String.raw`Para cada entero positivo $n$, sea $a(n)$ el número de ceros en la representación en base 3 de $n$. ¿Para qué números reales positivos $x$ converge la serie $$ \sum_{n=1}^\infty \frac{x^{a(n)}}{n^3} ? $$`,
    String.raw`Para cada entero $k \geq 0$, el entero $n$ en base 3 tiene $k+1$ dígitos si y solo si $3^k \leq n < 3^{k+1} - 1$. Entre los enteros en este intervalo hay $\binom{k}{i}2^{k+1-i}$ para los cuales $a(n) = i$, así que $$ \sum_{n=3^k}^{3^{k+1}-1} x^{a(n)} = \sum_{i=0}^{k} \binom{k}{i} x^i 2^{k+1-i} = 2(x + 2)^k. $$ Por lo tanto $$ \frac{2(x + 2)^k}{3^{3k+3}} < \frac{\sum_{n=3^k}^{3^{k+1}-1} x^{a(n)}}{n^3} < \frac{2(x + 2)^k}{3^{3k}}, $$ y por lo tanto $$ \frac{2}{27} \sum_{k=0}^{m} \left(\frac{x + 2}{27}\right)^k < \sum_{n=1}^{3^{m+1}-1} \frac{x^{a(n)}}{n^3} < 2 \sum_{k=0}^{m} \left(\frac{x + 2}{27}\right)^k. $$ Se sigue que la serie converge (para $x > 0$) si y solo si $(x + 2)/27 < 1$, es decir, si y solo si $0 < x < \boxed{25}$.`),
  putnam('PUTNAM-1987-B1', 1987, 'B', 1, 'Simetría que reduce una integral con logaritmos anidados', 'Análisis',
    String.raw`Evalúa $$ \int_2^4 \frac{\sqrt{\ln(9-x)}\,dx}{\sqrt{\ln(9-x)}+\sqrt{\ln(x+3)}}. $$`,
    String.raw`Sea $I$ el valor de la integral. La sustitución $9 - x = y + 3$ da $$ I = \int_2^4 \frac{\sqrt{\ln(y+3)}\,dy}{\sqrt{\ln(y+3)}+\sqrt{\ln(9-y)}}. $$ Así, $$ 2I = \int_2^4 \frac{\sqrt{\ln(x+3)} + \sqrt{\ln(9-x)}}{\sqrt{\ln(x+3)} + \sqrt{\ln(9-x)}}\,dx = \int_2^4 1 \, dx = 2, $$ y $I = \boxed{1}$.`),
]

const putnam1988 = [
  putnam('PUTNAM-1988-A1', 1988, 'A', 1, 'Área de la región |x|−|y|≤1 y |y|≤1', 'Geometría',
    String.raw`Sea $R$ la región formada por los puntos $(x,y)$ del plano cartesiano que satisfacen tanto $|x|-|y| \leq 1$ como $|y| \leq 1$. Dibuja la región $R$ y encuentra su área.`,
    String.raw`La parte de $R$ en el primer cuadrante está acotada por $x = 0$, $y = 0$, $x - y = 1$ y $y = 1$. Esta parte es un trapecio con vértices $(0,0)$, $(1,0)$, $(2,1)$ y $(0,1)$, con área $3/2$. Como $(\pm x, \pm y)$ está en $R$ cuando $(x, y)$ está en $R$, las partes de $R$ en los otros cuadrantes se obtienen por simetría respecto a ambos ejes, y por lo tanto el área de $R$ es $\boxed{6}$.`),
  putnam('PUTNAM-1988-A3', 1988, 'A', 3, 'Convergencia de una serie con potencias de csc(1/n)/n − 1', 'Análisis',
    String.raw`Determina, con demostración, el conjunto de números reales $x$ para los cuales $$ \sum_{n=1}^\infty \left( \frac{1}{n} \csc \frac{1}{n} - 1 \right)^x $$ converge.`,
    String.raw`Sea $$ a_n = \frac{1}{n} \csc \frac{1}{n} - 1 = \frac{1}{n\sin(1/n)} - 1. $$ Usando la aproximación $\sin t \approx t - \frac{t^3}{6} + \dots$ para $t$ pequeño, se obtiene $$ a_n = \frac{1}{n^2}\left(\frac{1}{6} + g(n)\right), $$ donde $g(n) \to 0$ cuando $n \to \infty$. Por lo tanto existen reales positivos $c$, $d$ y $N$ tales que $$ \frac{c}{n^2} \leq a_n \leq \frac{d}{n^2} $$ para $n > N$. Usando comparación y el criterio de la $p$-serie, se encuentra que $\sum a_n^x$ converge para $x > 1/2$ y diverge para $0 < x \leq 1/2$. Por lo tanto, la respuesta es $\{x : x > \boxed{1/2}\}$.`),
  putnam('PUTNAM-1988-B3', 1988, 'B', 3, 'Menor cota g para |c−d√3| minimizado con c+d=n', 'Teoría de Números',
    String.raw`Para cada $n$ en el conjunto $\mathbb{N} = \{1,2,\dots\}$ de enteros positivos, sea $r_n$ el valor mínimo de $|c-d\sqrt{3}|$ sobre todos los enteros no negativos $c$ y $d$ con $c+d=n$. Encuentra, con demostración, el menor número real positivo $g$ tal que $r_n \leq g$ para todo $n \in \mathbb{N}$.`,
    String.raw`Sea $g = (1 + \sqrt{3})/2$. Como, para cada valor fijo de $n$, la sucesión $$ n,\ n - 1 - \sqrt{3},\ n - 2 - 2\sqrt{3},\ \dots,\ -n\sqrt{3} $$ es una progresión aritmética con diferencia común $-2g$, hay un único término $x_n$ en ella con $-g < x_n < g$. Claramente $r_n = |x_n|$. Sea $\varepsilon > 0$. Por el principio del palomar, existen $a$ y $b$ con $a \neq b$ y $|x_a - x_b| < \varepsilon$. Sea $t = |a - b|$. En la sucesión $r_t, r_{2t}, r_{3t}, \dots$, hay un $r_{kt}$ tal que $g - \varepsilon < r_{kt} \leq g$. Por lo tanto, $g = \boxed{\frac{1+\sqrt{3}}{2}}$ es la cota superior mínima deseada de los $r_n$.`),
  putnam('PUTNAM-1988-B5', 1988, 'B', 5, 'Rango de una matriz antisimétrica de bandas alternadas', 'Álgebra Lineal',
    String.raw`Para enteros positivos $n$, sea $M_n$ la matriz antisimétrica de $(2n+1) \times (2n+1)$ para la cual cada entrada en las primeras $n$ subdiagonales debajo de la diagonal principal es $1$, y cada una de las entradas restantes debajo de la diagonal principal es $-1$. Encuentra, con demostración, el rango de $M_n$. (Según una definición, el rango de una matriz es el mayor $k$ tal que existe una submatriz de $k \times k$ con determinante distinto de cero.) Por ejemplo, $$ M_1 = \left( \begin{array}{ccc} 0 & -1 & 1 \\ 1 & 0 & -1 \\ -1 & 1 & 0 \end{array}\right), \qquad M_2 = \left( \begin{array}{ccccc} 0 & -1 & -1 & 1 & 1 \\ 1 & 0 & -1 & -1 & 1 \\ 1 & 1 & 0 & -1 & -1 \\ -1 & 1 & 1 & 0 & -1 \\ -1 & -1 & 1 & 1 & 0 \end{array} \right). $$`,
    String.raw`Sea $u$ una raíz $k$-ésima primitiva de $1$, donde $k = 2n+1$. Para $1 \leq i \leq k$, sea $L_i$ el vector columna $(1, u^{i-1}, u^{2(i-1)}, \dots, u^{(k-1)(i-1)})$. La matriz $k \times k$ cuya $i$-ésima columna es $L_i$ es una matriz de Vandermonde, así que los $L_i$ son linealmente independientes sobre los números complejos. Para $1 \leq i \leq k$ tenemos $M_n L_i = c_i L_i$, donde $c_i$ es el producto punto de $L_i$ con la primera fila de $M_n$. Observa que $c_1 = 0$, pero para $2 \leq i \leq k$, $$ c_i = -\sum_{j=2}^{n+1} u^{(j-1)(i-1)} + \sum_{j=n+2}^k u^{(j-1)(i-1)} \neq 0. $$ Se sigue que los vectores $\{c_2L_2, \dots, c_kL_k\}$, y por lo tanto los vectores $\{M_nL_2, \dots, M_nL_k\}$, son linealmente independientes. Pero $M_nL_1 = c_1L_1 = 0$, así que $M_n$ tiene rango $\boxed{2n}$.`),
]

const putnam1989 = [
  putnam('PUTNAM-1989-A1', 1989, 'A', 1, "Primos alternando 1's y 0's que empiezan y terminan en 1", 'Teoría de Números',
    String.raw`¿Cuántos números primos, entre los enteros positivos escritos como es usual en base 10, alternan 1's y 0's, comenzando y terminando en 1?`,
    String.raw`Sea $N_k$ el número $$ 101010\ldots101 $$ con exactamente $k$ dígitos iguales a $0$. Si $k = 1$, de modo que $N_k = 101$, entonces $N_k$ es primo. Todos los demás $N_k$ son compuestos, como muestra el siguiente razonamiento. Si $k$ es impar, entonces $101$ divide a $N_k$. Si $k$ es par, entonces $$ 11N_k = R \cdot S, $$ donde $R$ es el número que consiste de $k+1$ dígitos todos iguales a $1$ y $S$ es el número con $k+2$ dígitos que empieza y termina en $1$ y solo tiene $0$'s en medio. Uno de los números $R$ y $S$ divide a $N_k$. Por lo tanto la respuesta es $\boxed{1}$.`),
  putnam('PUTNAM-1989-A2', 1989, 'A', 2, 'Integral doble de e^max(b²x²,a²y²) dividida por la diagonal', 'Análisis',
    String.raw`Evalúa $\int_0^a\int_0^b e^{\max\{b^2x^2, a^2y^2\}}\,dy\,dx$ donde $a$ y $b$ son positivos.`,
    String.raw`Divide la región en dos partes mediante la recta diagonal $ay = bx$ para obtener $$ \int_0^a\int_0^b e^{\max\{b^2x^2, a^2y^2\}}\,dy\,dx = \int_0^a \int_0^{bx/a} e^{b^2x^2}\,dy\,dx + \int_0^b \int_0^{ay/b} e^{a^2y^2}\,dx\,dy $$ $$ = \int_0^a \frac{bx}{a} e^{b^2x^2}\,dx + \int_0^b \frac{ay}{b} e^{a^2y^2}\,dy = \boxed{\frac{e^{a^2b^2} - 1}{ab}}. $$`),
  putnam('PUTNAM-1989-A3', 1989, 'A', 3, 'Módulo unitario forzado por una ecuación polinomial en z', 'Números Complejos',
    String.raw`Demuestra que si $$ 11z^{10}+10iz^9+10iz-11=0, $$ entonces $|z|=1$. (Aquí $z$ es un número complejo e $i^2=-1$.)`,
    String.raw`Tenemos $z^9 = \frac{11 - 10iz}{11z + 10i}$. Si $z = a + bi$, entonces $$ |z^9| = \left| \frac{11 - 10iz}{11z + 10i} \right| = \sqrt{\frac{11^2 + 220b + 10^2(a^2 + b^2)}{11^2(a^2 + b^2) + 220b + 10^2}} \equiv \frac{f(a,b)}{g(a,b)}. $$ Si $a^2 + b^2 > 1$, entonces $g(a,b) > f(a,b)$, lo que haría $|z^9| < 1$, una contradicción. Si $a^2 + b^2 < 1$, entonces $f(a,b) > g(a,b)$, lo que haría $|z^9| > 1$, otra contradicción. Por lo tanto, $|z| = \boxed{1}$.`),
  putnam('PUTNAM-1989-B1', 1989, 'B', 1, 'Probabilidad de que un dardo caiga más cerca del centro que de un borde', 'Geometría',
    String.raw`Se lanza un dardo al azar y golpea un blanco cuadrado. Suponiendo que dos partes cualesquiera del blanco con igual área tienen la misma probabilidad de ser golpeadas, encuentra la probabilidad de que el punto golpeado esté más cerca del centro que de cualquier borde. Expresa tu respuesta en la forma $\frac{a\sqrt{b} + c}{d}$, donde $a,\,b,\,c,\,d$ son enteros.`,
    String.raw`Considera un tablero de $2 \times 2$ centrado en el origen con vértices en $(1, 1)$, $(-1, 1)$, $(-1, -1)$ y $(1, -1)$. Un punto $(x, y)$ del cuadrado está más cerca del centro del tablero que del borde superior si y solo si $$ \sqrt{x^2 + y^2} \leq 1 - y, $$ o equivalentemente, $$ y \leq \frac{1 - x^2}{2}. $$ Aparece una región parabólica similar para cada uno de los otros tres lados, y por lo tanto la región de puntos más cercanos al centro que a cualquier borde tiene la forma de la región sombreada correspondiente. Sea $A$ el área de esta región en el primer cuadrante acotada por $y = \frac{1-x^2}{2}$ y $y = x$. Entonces la probabilidad buscada es $$ \frac{8 \cdot A}{4} = 2A = 2\int_0^{\sqrt{2}-1} \left( \frac{1 - x^2}{2} - x \right) dx = \boxed{\frac{4\sqrt{2} - 5}{3}}. $$`),
  putnam('PUTNAM-1989-B3', 1989, 'B', 3, "Momentos de una función que satisface f'=−3f+6f(2x)", 'Análisis',
    String.raw`Sea $f$ una función en $[0,\infty)$, diferenciable, que satisface $$ f'(x)=-3f(x)+6f(2x) $$ para $x>0$. Supón que $|f(x)|\le e^{-\sqrt{x}}$ para $x\ge 0$ (de modo que $f(x)$ tiende rápidamente a $0$ conforme $x$ crece). Para $n$ un entero no negativo, define $$ \mu_n=\int_0^\infty x^n f(x)\,dx $$ (a veces llamado el $n$-ésimo momento de $f$). a) Expresa $\mu_n$ en términos de $\mu_0$. b) Demuestra que la sucesión $\{\mu_n 3^n/n!\}$ siempre converge, y que el límite es $0$ solo si $\mu_0=0$.`,
    String.raw`Claramente, $\int_0^\infty x^n g(x)\,dx$ existe para $g(x)$ igual a $f(x)$ o $f'(x)$, porque $f(x)$ tiende rápidamente a $0$. Por lo tanto, $$ \int_0^\infty x^n f'(x)\,dx = -3\mu_n + 6\int_0^\infty x^n f(2x)\,dx. $$ Usando integración por partes en la integral de la izquierda y la sustitución $u = 2x$ en la de la derecha, obtenemos $$ x^n f(x) \Big|_0^\infty - n\mu_{n-1} = -3\mu_n + \frac{6}{2^{n+1}}\mu_n. $$ Como $x^n f(x) \to 0$ cuando $x \to \infty$ para cualquier $n > 0$, tenemos $$ \mu_n = \frac{n}{3} \cdot \frac{1}{1 - \frac{1}{2^n}} \mu_{n-1}. $$ Iterando se obtiene $$ \mu_n = \boxed{\frac{n!}{3^n} \prod_{m=1}^n \left( 1 - \frac{1}{2^m} \right) \mu_0}. $$`),
  putnam('PUTNAM-1989-B5', 1989, 'B', 5, 'Cota óptima (s1−s2)/d para un trapecio cíclico', 'Geometría',
    String.raw`Etiqueta los vértices de un trapecio $T$ (cuadrilátero con dos lados paralelos) inscrito en el círculo unitario como $A,\,B,\,C,\,D$ de modo que $AB$ sea paralelo a $CD$ y $A,\,B,\,C,\,D$ estén en orden antihorario. Sean $s_1,\,s_2$ y $d$ las longitudes de los segmentos $AB$, $CD$ y $OE$, donde $E$ es el punto de intersección de las diagonales de $T$, y $O$ es el centro del círculo. Determina la mínima cota superior de $\frac{s_1-s_2}{d}$ sobre todos esos $T$ para los cuales $d\ne 0$, y describe todos los casos, si los hay, en que se alcanza.`,
    String.raw`Elige coordenadas de modo que $AB$ y $CD$ sean verticales, y de modo que $E$ esté sobre el eje $x$. Para una pendiente apropiada $m$, $B$ y $D$ están en la intersección de $y = m(x + d)$ con $x^2 + y^2 = 1$. Por lo tanto, $$ y^2 + \left(\frac{y}{m} - d\right)^2 = 1, $$ o equivalentemente, $$ \left(1 + \frac{1}{m^2}\right) y^2 - \frac{2d}{m} y + (d^2 - 1) = 0. $$ Ahora (considerando las coordenadas $y$), $s_1 - s_2$ es el doble de la suma de las raíces de esta ecuación, y por lo tanto, $$ s_1 - s_2 = 2\left(\frac{2m}{1+m^2}\right)d \leq 2d, $$ con igualdad si y solo si $m = 1$. Así, para $d \neq 0$, el valor máximo de $(s_1-s_2)/d$ es $\boxed{2}$, y se alcanza si y solo si las diagonales se intersecan en ángulo recto y $T$ no es un cuadrado (ya que $d = 0$ para un cuadrado).`),
]

const putnam1990 = [
  putnam('PUTNAM-1990-A1', 1990, 'A', 1, 'Fórmula T_n = n! + 2^n para una recursión de tercer orden', 'Teoría de Números',
    String.raw`Sean $$ T_0 = 2, \quad T_1 = 3, \quad T_2 = 6, $$ y para $n \geq 3$, $$ T_n = (n+4)T_{n-1} - 4n T_{n-2} + (4n-8) T_{n-3}. $$ Los primeros términos son $$ 2, 3, 6, 14, 40, 152, 784, 5168, 40576. $$ Encuentra, con demostración, una fórmula para $T_n$ de la forma $T_n = A_n + B_n$, donde $\{A_n\}$ y $\{B_n\}$ son sucesiones bien conocidas.`,
    String.raw`Esto se puede verificar por inducción. Alternativamente, sea $t_n = n! + 2^n$. Claramente $t_0 = 2 = T_0$, $t_1 = 3 = T_1$ y $t_2 = 6 = T_2$. Además, $$ t_n - nt_{n-1} = 2^n - n2^{n-1}. $$ Ahora bien, $2^n$ y $n2^{n-1}$ son ambas soluciones de la ecuación de recurrencia $$ f_n - 4f_{n-1} + 4f_{n-2} = 0, \quad (*) $$ lo cual se comprueba por sustitución directa. Por lo tanto, como $t_n - nt_{n-1}$ es una combinación lineal de soluciones de $(*)$, también debe ser una solución. En consecuencia, $$ (t_n - nt_{n-1}) - 4(t_{n-1} - (n - 1)t_{n-2}) + 4(t_{n-2} - (n - 2)t_{n-3}) = 0, $$ o bien $$ t_n = (n + 4)t_{n-1} - 4nt_{n-2} + (4n - 8)t_{n-3}. $$ Por lo tanto $t_n = T_n$, ya que son idénticas para $n = 0, 1, 2$ y satisfacen la misma recurrencia de tercer orden $(*)$ para $n \geq 3$. La fórmula para $T_n$ es $$ T_n = \boxed{n! + 2^n}. $$`),
  putnam('PUTNAM-1990-A3', 1990, 'A', 3, 'Área mínima 5/2 de un pentágono convexo de coordenadas enteras', 'Geometría',
    String.raw`Demuestra que cualquier pentágono convexo cuyos vértices (sin que tres sean colineales) tienen coordenadas enteras debe tener área mayor o igual a $5/2$.`,
    String.raw`Por la fórmula de Pick, el área es $I + B/2 - 1$, donde $I$ es el número de puntos de red internos y $B$ es el número de puntos de red en la frontera. Claramente, $I \geq 0$ y $B \geq 5$. Si $I \geq 1$, hemos terminado. Si $I = 0$, separa los vértices $v_1, v_2, v_3, v_4, v_5$ en cuatro clases según la paridad de sus coordenadas. Al menos una clase debe tener al menos dos elementos, digamos $v_1$ y $v_2$. Entonces el punto medio $\frac{1}{2}(v_1 + v_2)$ también es un punto de red; llámalo $v_0$. Como $I = 0$, $v_0$ está en la frontera del pentágono. Ahora considera los cinco puntos $\{v_0, v_2, v_3, v_4, v_5\}$. El mismo razonamiento produce un segundo punto de red $v_0^*$ que no es $v_1$ (ya que $v_0^*$ es un punto medio) y que no está en el interior (ya que $I = 0$). Así obtenemos un segundo punto de red nuevo en la frontera. Por lo tanto, $B \geq 7$, así que de nuevo el área es $\geq \boxed{5/2}$.`),
  putnam('PUTNAM-1990-A4', 1990, 'A', 4, 'Mínimo de perforaciones para eliminar todo punto del plano', 'Geometría',
    String.raw`Considera un perforador de papel que puede centrarse en cualquier punto del plano y que, al operarse, elimina del plano precisamente los puntos cuya distancia al centro es irracional. ¿Cuántas perforaciones se necesitan para eliminar todo punto?`,
    String.raw`La respuesta es ciertamente mayor que 2. Razón: para cualesquiera dos puntos distintos, existe al menos un punto cuya distancia a cada uno de los dados es racional (dibuja círculos centrados en los puntos dados con radios racionales; si los radios no se eligen descuidadamente, los círculos se intersecarán; basta elegir los radios mayores que la mitad de la distancia dada pero menores que la distancia completa). Tres perforaciones son suficientes. En efecto: perfora dos veces, en centros distintos. Como cada perforación deja numerablemente muchos círculos, las dos perforaciones dejan sus intersecciones, un conjunto numerable. Considera todos los círculos centrados en puntos de ese conjunto, con radios racionales; sus intersecciones con una recta arbitraria forman un conjunto numerable. Un punto de esa recta que no esté en ese conjunto numerable está a distancia irracional de todos los puntos restantes; aplica ahí la tercera perforación. Por lo tanto, el número mínimo de perforaciones necesarias es $\boxed{3}$.`),
  putnam('PUTNAM-1990-A6', 1990, 'A', 6, 'Conteo de pares admisibles de subconjuntos vía Fibonacci', 'Combinatoria',
    String.raw`Si $X$ es un conjunto finito, sea $|X|$ el número de elementos de $X$. Llama a un par ordenado $(S, T)$ de subconjuntos de $\{1, 2, \dots, n\}$ admisible si $s > |T|$ para cada $s \in S$, y $t > |S|$ para cada $t \in T$. ¿Cuántos pares ordenados admisibles de subconjuntos de $\{1, 2, \dots, 10\}$ hay? Demuestra tu respuesta.`,
    String.raw`Sea $A_n$ el número de pares ordenados admisibles de subconjuntos de $\{1, 2, \dots, n\}$. Claramente $$ A_n = \sum_{0 \leq i, j \leq n} \binom{n-i}{j} \binom{n-j}{i}. $$ Define $$ B_n = \sum_{0 \leq i, j \leq n} \binom{n+1-i}{j} \binom{n-j}{i}. $$ Claramente $A_0 = B_0 = 1$, y $$ B_n - A_n = \sum_{0 \leq i, j \leq n} \binom{n-i}{j} \binom{n-j-1}{i} = B_{n-1}, $$ mientras que $$ A_n - B_{n-1} = \sum_{0 \leq i, j \leq n} \binom{n-i}{j} \binom{n-j-1}{i-1} + 2 = A_{n-1} + 1. $$ Por lo tanto, se verifica inmediatamente por inducción que $$ A_n = F_{2n+2}, \quad B_n = F_{2n+3}-1. $$ Entonces, $A_{10} = F_{22} = \boxed{17711}$. ($F_i$ es el $i$-ésimo número de Fibonacci, definido por $F_0 = 0$, $F_1 = 1$, y para $n \geq 2$, $F_n = F_{n-1} + F_{n-2}$.)`),
  putnam('PUTNAM-1990-B1', 1990, 'B', 1, "Funciones f con (f')²+f²=∫(f²+f'²)+1990", 'Análisis',
    String.raw`Encuentra todas las funciones $f$ de valor real, continuamente diferenciables en la recta real, tales que para todo $x$, $$ (f(x))^2 = \int_0^x [(f(t))^2 + (f'(t))^2]\,dt + 1990. $$`,
    String.raw`Hay exactamente dos funciones así: $f(x) = \sqrt{1990}\, e^x$ y $f(x) = -\sqrt{1990}\, e^x$. Para verlo, supón que se cumple la identidad. Derivando ambos lados se obtiene $$ 2f(x)f'(x) = (f(x))^2 + (f'(x))^2, $$ o equivalentemente, $$ (f(x) - f'(x))^2 = 0, \quad f'(x) = f(x), $$ $$ \log|f(x)| = x + C, \quad |f(x)| = e^C e^x. $$ Pero $f$ es continua y $f(0) = \pm\sqrt{1990}$, y esto implica que $\boxed{f(x) = \pm\sqrt{1990}\, e^x}$.`),
  putnam('PUTNAM-1990-B3', 1990, 'B', 3, '50387 matrices de entradas cuadradas fuerzan dos que conmutan', 'Combinatoria',
    String.raw`Sea $S$ un conjunto de matrices enteras de $2 \times 2$ cuyas entradas $a_{ij}$ (1) son todas cuadrados de enteros y (2) satisfacen $a_{ij} \leq 200$. Demuestra que si $S$ tiene más de 50387 ($= 15^4 - 15^2 - 15 + 2$) elementos, entonces tiene dos elementos que conmutan.`,
    String.raw`Sea $U$ el conjunto de todas esas matrices de $2\times 2$, $D$ las diagonales, y $J$ las que son múltiplos de $\begin{pmatrix} 1 & 1 \\ 1 & 1 \end{pmatrix}$. Observa que (i) dos elementos cualesquiera de $D$ conmutan, (ii) dos elementos cualesquiera de $J$ conmutan, y (iii) $\begin{pmatrix} 1 & 1 \\ 0 & 1 \end{pmatrix}$ y $\begin{pmatrix} 1 & 4 \\ 0 & 1 \end{pmatrix}$ conmutan. Claramente, $$ |U \cap (D \cup J)^c| = |U| - |D| - |J| + |D \cap J| = 15^4 - 15^2 - 15 + 1. $$ Supón que ningún par de elementos de $S$ conmuta, y escribe $$ S = (S \cap (D \cup J)) \cup (S \cap (D \cup J)^c). $$ Claramente, $|S \cap (D \cup J)| \leq 2$ y (por (iii)) $$ |S \cap (D \cup J)^c| < |U \cap (D \cup J)^c| \leq 15^4 - 15^2 - 15 + 1. $$ El resultado se sigue, dándonos $\boxed{2}$ elementos que conmutan. (Aquí $X^c$ denota el complemento de $X$.)`),
  putnam('PUTNAM-1990-B6', 1990, 'B', 6, 'Franja mínima que siempre corta un convexo acotado', 'Geometría',
    String.raw`Sea $S$ un conjunto convexo, cerrado, acotado y no vacío en el plano. Sea $K$ una recta y $t$ un número positivo. Sean $L_1$ y $L_2$ rectas de soporte de $S$ paralelas a $K$, y sea $\overline{L}$ la recta paralela a $K$ situada a la mitad de camino entre $L_1$ y $L_2$. Sea $B_S(K, t)$ la franja de puntos cuya distancia a $\overline{L}$ es a lo más $(t/2)w$, donde $w$ es la distancia entre $L_1$ y $L_2$. ¿Cuál es el menor $t$ tal que $$ S \cap \bigcap_K B_S(K, t) \neq \emptyset $$ para todo $S$? ($K$ recorre todas las rectas del plano.)`,
    String.raw`Considera la disección de un triángulo equilátero (como se muestra) en 9 triángulos equiláteros semejantes: esto muestra que cualquier $t < 1/3$ produce una intersección vacía. Ahora mostramos que la intersección es no vacía para $t \geq 1/3$, ya que siempre contiene al centroide de $S$. Piensa en $L_1$ como la recta de soporte superior (ver el esquema). Sea $P_1$ un punto de contacto de $L_1$ con $S$, y $P_2$ un punto de contacto de $L_2$ con $S$. Traza dos segmentos desde $P_1$ hasta puntos $Q_1, Q_2$ sobre $L_2$ de modo que $A_1$ —la región "arriba" de $P_1Q_1$ y dentro de $S$— tenga área igual a la de $B_1$ —la región "abajo" de $P_1Q_1$, arriba de $L_2$ y fuera de $S$—. Si $S$ se perturba reemplazando $A_1$ por $B_1$ (y de forma análoga $A_2$ por $B_2$), el nuevo $S$ (que resulta ser un triángulo) tendrá un centroide "más bajo", pero este nuevo centroide sigue estando a $1/3$ del camino por encima de $L_2$ (hacia $L_1$). Por lo tanto, si $\beta$ es una franja que comprende el tercio medio de la banda entre $L_1$ y $L_2$, contiene al centroide de $S$. Entonces para $t = 1/3$ la intersección es no vacía, así que $t = \boxed{1/3}$ es el menor valor posible.`),
]

const putnam1991 = [
  putnam('PUTNAM-1991-A1', 1991, 'A', 1, 'Área bajo la curva trazada por un rectángulo que rota', 'Geometría',
    String.raw`Un rectángulo de $2 \times 3$ tiene vértices en $(0, 0), (2,0), (0,3)$ y $(2, 3)$. Rota $90°$ en sentido horario alrededor del punto $(2, 0)$. Luego rota $90°$ en sentido horario alrededor del punto $(5, 0)$, después $90°$ en sentido horario alrededor del punto $(7, 0)$, y finalmente $90°$ en sentido horario alrededor del punto $(10, 0)$. (El lado que originalmente estaba sobre el eje $x$ vuelve a estar sobre el eje $x$.) Encuentra el área de la región por encima del eje $x$ y por debajo de la curva trazada por el punto cuya posición inicial es $(1,1)$.`,
    String.raw`El punto $(1,1)$ rota alrededor de $(2,0)$ hasta $(3,1)$, luego alrededor de $(5,0)$ hasta $(6,2)$, luego alrededor de $(7,0)$ hasta $(9,1)$, y luego alrededor de $(10,0)$ hasta $(11,1)$. El área en cuestión consiste de cuatro triángulos rectángulos de $1 \times 1$ con área $1/2$, cuatro triángulos rectángulos de $1 \times 2$ con área $1$, dos cuartos de círculo de área $(\pi/4)(\sqrt{2})^2 = \pi/2$, y dos cuartos de círculo de área $(\pi/4)(\sqrt{5})^2 = 5\pi/4$. Por lo tanto, el área total es $\boxed{\frac{7\pi}{2} + 6}$.`),
  putnam('PUTNAM-1991-A5', 1991, 'A', 5, 'Valor máximo de una integral con raíz de x⁴+(y−y²)²', 'Análisis',
    String.raw`Encuentra el valor máximo de $$ \int_0^y \sqrt{x^4 + (y-y^2)^2}\,dx $$ para $0 \leq y \leq 1$.`,
    String.raw`Para $0 \leq y \leq 1$, sea $I(y) = \int_0^y \sqrt{x^4 + (y-y^2)^2}\,dx$. Afirmación: $I'(y) \geq 0$, con igualdad solo en el caso (claramente no óptimo) $y = 0$. Para verlo, observa que $$ I'(y) = \sqrt{y^4 + (y-y^2)^2} + \int_0^y \frac{(y-y^2)(1-2y)}{\sqrt{x^4 + (y-y^2)^2}}\,dx. $$ Si $0 < y \leq 1/2$, claramente $I'(y)$ es positivo. Supón entonces que $y > 1/2$. Entonces $I'(y) > 0$ es equivalente a $$ \sqrt{y^4 + (y-y^2)^2} > (y-y^2)(2y-1)\int_0^y \frac{dx}{\sqrt{x^4 + (y-y^2)^2}}. $$ Como $$ \int_0^y \frac{dx}{\sqrt{x^4 + (y-y^2)^2}} \leq \int_0^y \frac{dx}{\sqrt{(y-y^2)^2}} = \frac{y}{y-y^2}, $$ basta mostrar que $$ \sqrt{y^4 + (y-y^2)^2} \geq (2y-1)y, \quad 1/2 \leq y \leq 1, $$ lo cual equivale a $$ y^2 + (1-y)^2 \geq (2y-1)^2 \iff 2y^2 - 2y + 1 \geq 4y^2 - 4y + 1 \iff 2y \geq 2y^2, $$ y esto último claramente es cierto. Ahora, para $y < 1$, $I(y) < I(1) = \int_0^1 x^2\,dx = 1/3$, así que $\boxed{1/3}$ es el máximo.`),
  putnam('PUTNAM-1991-B2', 1991, 'B', 2, 'f²+g² ≡ 1 a partir de una identidad tipo suma de ángulos', 'Análisis',
    String.raw`Supón que $f$ y $g$ son funciones no constantes, diferenciables, de valor real, definidas en $(-\infty, \infty)$. Además, supón que para cada par de números reales $x$ y $y$, $$ \begin{align*} f(x+y) &= f(x)f(y) - g(x)g(y), \\ g(x+y) &= f(x)g(y) + g(x)f(y). \end{align*} $$ Si $f'(0) = 0$, demuestra que $(f(x))^2 + (g(x))^2 = 1$ para todo $x$.`,
    String.raw`Deriva ambas ecuaciones respecto a $y$, obteniendo $$ f'(x+y) = f(x)f'(y) - g(x)g'(y), \qquad g'(x+y) = f(x)g'(y) + g(x)f'(y). $$ Haciendo $y = 0$ se obtiene $$ f'(x) = -g'(0)g(x) \quad \text{y} \quad g'(x) = g'(0)f(x). $$ Así, $$ 2f(x)f'(x) + 2g(x)g'(x) = 0, $$ y por lo tanto $$ (f(x))^2 + (g(x))^2 = C $$ para alguna constante $C$. Como $f$ y $g$ no son constantes, $C \neq 0$. De la identidad $$ [f(x+y)]^2 + [g(x+y)]^2 = [(f(x))^2 + (g(x))^2][(f(y))^2 + (g(y))^2], $$ vemos que $C = C^2$. Como $C \neq 0$, tenemos $\boxed{C = 1}$.`),
  putnam('PUTNAM-1991-B5', 1991, 'B', 5, 'Elementos en la intersección de cuadrados y cuadrados+1 mod p', 'Teoría de Números',
    String.raw`Sea $p$ un primo impar y sea $\mathbb{Z}_p$ el campo de los enteros módulo $p$. ¿Cuántos elementos hay en el conjunto $$ \{x^2: x \in \mathbb{Z}_p\} \cap \{y^2 + 1 : y \in \mathbb{Z}_p\}? $$`,
    String.raw`Considera primero el conjunto de soluciones de $$ x^2 = y^2 + 1. \quad (*) $$ Reescribiendo esto como $(x + y)(x - y) = 1$, vemos que para cada elemento no nulo $r$ de $\mathbb{Z}_p$, hay exactamente una solución de lo anterior, a saber, $x + y = r$, $x - y = r^{-1}$, o $$ x = \left(\frac{p + 1}{2}\right)(r + r^{-1}), \quad y = \left(\frac{p + 1}{2}\right)(r - r^{-1}). $$ Por lo tanto, hay $p - 1$ soluciones de $(*)$. Por otro lado, cada elemento $x^2 = y^2+1$ de la intersección también surge de los pares $(x, -y)$, $(-x, y)$ y $(-x, -y)$, además de $(x, y)$. Estos cuatro pares son distintos a menos que $x = 0$ o $y = 0$, en cuyo caso solo hay dos pares distintos. Observa que 1 surge de $(1,0)$ y de $(-1,0)$. Sea $c = 1$ si hay una solución con $x = 0$, y $c = 0$ si no la hay. Entonces la intersección tiene $1 + c + d$ elementos, donde, de lo anterior, $p - 1 = 2 + 2c + 4d$. Vemos que $c = 1$ si y solo si $p - 1$ es divisible entre 4. Resolviendo para $d$ en cada caso, encontramos que $1 + c + d = \lfloor (p + 3)/4 \rfloor$. Por lo tanto, hay $\boxed{\lfloor (p + 3)/4 \rfloor}$ elementos en la intersección.`),
  putnam('PUTNAM-1991-B6', 1991, 'B', 6, 'Mayor c para una desigualdad de medias ponderadas con sinh', 'Análisis',
    String.raw`Sean $a$ y $b$ números positivos. Encuentra el mayor número $c$, en términos de $a$ y $b$, tal que $$ a^x b^{1-x} \leq a \frac{\sinh ux}{\sinh u} + b \frac{\sinh u(1-x)}{\sinh u} $$ para todo $u$ con $0 < |u| \leq c$ y para todo $x$, $0 < x < 1$. (Nota: $\sinh u = (e^u - e^{-u})/2$.)`,
    String.raw`La desigualdad se satisface si y solo si $0 < |u| \leq |\ln(a/b)|$. El lado derecho es una función par de $u$; por lo tanto basta considerar $u > 0$. Reemplazar $x$ por $1-x$ e intercambiar $a$ y $b$ preserva la desigualdad, así que podemos suponer $a \geq b$. Sea $$ F(u) = a \frac{\sinh ux}{\sinh u} + b \frac{\sinh u(1-x)}{\sinh u} - a^x b^{1-x}. $$ Derivando $$ f(u) = \frac{\sinh ux}{\sinh u}, $$ encontramos que $f'(u) < 0$ si y solo si $g(u) = x \tanh u - \tanh xu < 0$. Esta última desigualdad se cumple porque $g(0) = 0$ y $g'(u) < 0$ para $u > 0$. Así, $f(u)$ es estrictamente decreciente en $u$, y por lo tanto también lo es $F(u)$. Si $a > b$, entonces $F(\ln(a/b)) = 0$, mientras que si $a = b$, entonces $\lim_{u \to 0^+}F(u) = 0$, con lo cual la demostración queda completa. (Nota: tomando el límite cuando $u \to 0$ se obtiene una demostración de la versión ponderada de la desigualdad entre la media aritmética y la media geométrica.) Por lo tanto, el mayor valor de $c$ es $\boxed{|\ln(a/b)|}$.`),
]

const putnam1992 = [
  putnam('PUTNAM-1992-A1', 1992, 'A', 1, 'Única función que satisface f(f(n))=n y f(f(n+2)+2)=n', 'Teoría de Números',
    String.raw`Demuestra que $f(n) = 1-n$ es la única función de valor entero definida en los enteros que satisface las siguientes condiciones: (i) $f(f(n)) = n$, para todos los enteros $n$; (ii) $f(f(n+2)+2) = n$ para todos los enteros $n$; (iii) $f(0) = 1$.`,
    String.raw`Si $f(n) = 1 - n$, entonces $f(f(n)) = f(1 - n) = 1 - (1 - n) = n$, así que (i) se cumple. De manera similar, $f(f(n + 2) + 2) = f((-n - 1) + 2) = f(1 - n) = n$, así que (ii) se cumple. Claramente (iii) se cumple, así que $f(n) = 1 - n$ satisface las condiciones. Recíprocamente, supón que $f$ satisface las tres condiciones dadas. De la condición (ii), $f(f(f(n + 2) + 2)) = f(n)$, y aplicando (i) se obtiene $f(n + 2) + 2 = f(n)$, es decir, $f(n + 2) = f(n) - 2$. Una inducción sencilla da $$ f(n) = \begin{cases} f(0) - n & \text{si } n \text{ es par,} \\ f(1) + 1 - n & \text{si } n \text{ es impar.} \end{cases} $$ Como $f(0) = 1$, se tiene $f(1) = 0$ por (i), y por lo tanto $f(n) = \boxed{1 - n}$.`),
  putnam('PUTNAM-1992-A2', 1992, 'A', 2, 'Integral de un coeficiente binomial generalizado y suma armónica', 'Álgebra',
    String.raw`Define $C(\alpha)$ como el coeficiente de $x^{1992}$ en la serie de potencias alrededor de $x=0$ de $(1 + x)^\alpha$. Evalúa $$ \int_0^1 \left( C(-y-1) \sum_{k=1}^{1992} \frac{1}{y+k} \right)\,dy. $$`,
    String.raw`De la serie binomial, vemos que $$ C(-y - 1) = \frac{(-y - 1)(-y - 2) \cdots (-y - 1992)}{1992!} = \frac{(y + 1)(y + 2) \cdots (y + 1992)}{1992!}. $$ Por lo tanto, $$ C(-y - 1) \left( \frac{1}{y + 1} + \frac{1}{y + 2} + \cdots + \frac{1}{y + 1992} \right) = \frac{d}{dy} \left( \frac{(y + 1)(y + 2) \cdots (y + 1992)}{1992!} \right). $$ Entonces la integral en cuestión es $$ \int_0^1 \frac{d}{dy} \left( \frac{(y + 1)(y + 2) \cdots (y + 1992)}{1992!} \right) dy = \frac{(y + 1)(y + 2) \cdots (y + 1992)}{1992!} \bigg|_0^1 = 1993 - 1 = \boxed{1992}. $$`),
  putnam('PUTNAM-1992-A3', 1992, 'A', 3, 'Triples (n,x,y) con (x²+y²)^m = (xy)^n', 'Teoría de Números',
    String.raw`Para un entero positivo $m$ dado, encuentra todas las ternas $(n, x, y)$ de enteros positivos, con $n$ primo relativo a $m$, que satisfacen $$ (x^2 + y^2)^m = (xy)^n. $$`,
    String.raw`No hay soluciones si $m$ es impar. Si $m$ es par, la única solución es $(n, x, y) = (m + 1, 2^{m/2}, 2^{m/2})$. Si $(n, x, y)$ es una solución, entonces por la desigualdad entre la media aritmética y la media geométrica, $(xy)^n = (x^2 + y^2)^m \geq (2xy)^m$, así que $n > m$. Sea $p$ un número primo. Sean $a$ y $b$ las mayores potencias de $p$ que dividen a $x$ y a $y$, respectivamente. Entonces la mayor potencia de $p$ que divide a $(xy)^n$ es $(a + b)n$. Si $a < b$, la mayor potencia de $p$ que divide a $(x^2 + y^2)^m$ es $2am$. Pero esto implicaría $(a + b)n = 2am$, lo cual contradice $n > m$. De manera similar, suponer $a > b$ lleva a una contradicción. Por lo tanto $a = b$ para todo primo $p$, y concluimos que $x = y$. Así, la ecuación se reduce a $(2x^2)^m = x^{2n}$, o equivalentemente, $x^{2(n-m)} = 2^m$. Se sigue que $x$ es una potencia positiva de 2, digamos $2^a$. Esto implica $2(n - m)a = m$, o $2an = (2a + 1)m$. Como $\gcd(m, n) = \gcd(2a, 2a + 1) = 1$, debemos tener $m = 2a$ y $n = 2a + 1$. Por lo tanto, $m$ es necesariamente par y se obtiene la solución $\boxed{(m + 1, 2^{m/2}, 2^{m/2})}$ como se afirmó.`),
  putnam('PUTNAM-1992-A4', 1992, 'A', 4, 'Derivadas en 0 de f dado f(1/n) = n²/(n²+1)', 'Análisis',
    String.raw`Sea $f$ una función real infinitamente diferenciable definida en los números reales. Si $$ f\left( \frac{1}{n} \right) = \frac{n^2}{n^2 + 1}, \qquad n = 1, 2, 3, \dots, $$ calcula los valores de las derivadas $f^{(k)}(0)$, $k = 1, 2, 3, \dots$.`,
    String.raw`Primero observamos que si $h(x)$ es una función diferenciable y $x_1, x_2, \dots$ es una sucesión estrictamente decreciente a 0 tal que $h(x_n) = 0$, entonces por el teorema de Rolle, existe una sucesión $y_1, y_2, \dots$, estrictamente decreciente a 0, tal que $h'(y_n) = 0$ (con $x_{n+1} < y_n < x_n$). Ahora sea $g(x) = f(x) - \frac{1}{1 + x^2}$. Entonces $g(1/n) = 0$ para $n = 1, 2, \dots$. Aplicando el resultado del párrafo anterior a $g, g', g'', \dots$ e invocando la continuidad de $g^{(k)}$ en 0, vemos que $g^{(k)}(0) = 0$ para $k = 0, 1, 2, 3, \dots$. Por lo tanto, $$ f^{(k)}(0) = \frac{d^k}{dx^k} \left( \frac{1}{1 + x^2} \right) \bigg|_{x=0}. $$ La serie de Maclaurin de $\frac{1}{1 + x^2}$ es $\sum_{k=0}^{\infty} (-1)^k x^{2k}$, la cual solo tiene términos de grado par; por lo tanto $f^{(k)}(0) = 0$ para $k$ impar, y $$ f^{(k)}(0) = \boxed{(-1)^{k/2}k!} \quad \text{para } k \text{ par}. $$`),
  putnam('PUTNAM-1992-A6', 1992, 'A', 6, 'Probabilidad de que el centro quede dentro de un tetraedro esférico', 'Geometría',
    String.raw`Se eligen cuatro puntos al azar sobre la superficie de una esfera. ¿Cuál es la probabilidad de que el centro de la esfera quede dentro del tetraedro cuyos vértices son los cuatro puntos? (Se entiende que cada punto se elige de forma independiente respecto a una distribución uniforme sobre la esfera.)`,
    String.raw`Recuerda primero que si los puntos $A, B, C, D$ están en posición general en el espacio, un punto $E$ está dentro del tetraedro $ABCD$ si y solo si las coordenadas baricéntricas de $E$ respecto a $A, B, C, D$ son positivas. Es decir, si expresamos (de forma única) $$ \vec{E} = w\vec{A} + x\vec{B} + y\vec{C} + z\vec{D}, \text{ con } w + x + y + z = 1, $$ entonces $E$ está en el interior de $ABCD$ si y solo si $w > 0$, $x > 0$, $y > 0$, y $z > 0$. Por lo tanto, si $E$ es el origen, $E$ está en el interior de $ABCD$ si y solo si existe una solución $(w, x, y, z)$ de $$ \vec{0} = w\vec{A} + x\vec{B} + y\vec{C} + z\vec{D}, $$ con $w, x, y, z$ del mismo signo. Como el espacio de soluciones de esta ecuación es unidimensional, esta condición se cumple para una solución no nula si y solo si se cumple para todas. Supón ahora que el centro de la esfera está en el origen, y fija el primer punto elegido $P$ como el polo norte, siendo los otros tres puntos, $P_1, P_2, P_3$, aleatorios. Podemos suponer que la elección de cada $P_i$ se hace en dos pasos: primero eligiendo un diámetro aleatorio $Q_{i1}Q_{i2}$, y luego eligiendo al azar entre los extremos $Q_{i1}, Q_{i2}$. Como las $2^3=8$ posibles selecciones de extremos de los tres diámetros son igualmente probables, cada uno de los 8 tetraedros $PQ_{1j_1}Q_{2j_2}Q_{3j_3}$, con $j_i=1$ o $2$, es igualmente probable. Podemos además suponer que los vértices de cada uno de estos tetraedros están en posición general, ya que la probabilidad de degeneración es 0; de manera similar, podemos suponer que el centro de la esfera no está sobre ninguna cara de los tetraedros. Sea $(w, x, y, z)$ una solución no nula de $$ \vec{0} = w\vec{P} + x\vec{Q}_{11} + y\vec{Q}_{21} + z\vec{Q}_{31}. $$ Entonces, como $\vec{Q}_{i1} = -\vec{Q}_{i2}$, las ocho ecuaciones $$ \vec{0} = w\vec{P} + x\vec{Q}_{1j_1} + y\vec{Q}_{2j_2} + z\vec{Q}_{3j_3} $$ tienen, respectivamente, soluciones $$ (w, x, y, z),\ (w, x, y, -z),\ (w, x, -y, z),\ (w, x, -y, -z), $$ $$ (w, -x, y, z),\ (w, -x, y, -z),\ (w, -x, -y, z),\ (w, -x, -y, -z). $$ Por lo tanto, exactamente una de las ocho ecuaciones tiene una solución cuyas coordenadas tienen el mismo signo. Se sigue que exactamente uno de estos 8 tetraedros igualmente probables contiene el centro. Así, la probabilidad de incluir el centro es $1/8$ para cualquier elección inicial de los 3 diámetros. Concluimos que la probabilidad para un tetraedro aleatorio es $\boxed{1/8}$.`),
  putnam('PUTNAM-1992-B1', 1992, 'B', 1, 'Menor número de promedios distintos de un conjunto de n reales', 'Teoría de Números',
    String.raw`Sea $S$ un conjunto de $n$ números reales distintos. Sea $A_S$ el conjunto de números que ocurren como promedios de dos elementos distintos de $S$. Para un $n \geq 2$ dado, ¿cuál es el menor número posible de elementos de $A_S$?`,
    String.raw`El menor número posible de elementos de $A_S$ es $2n - 3$. Sean $x_1 < x_2 < \cdots < x_n$ los elementos de $S$. Entonces $$ \frac{x_1 + x_2}{2} < \frac{x_1 + x_3}{2} < \cdots < \frac{x_1 + x_n}{2} < \frac{x_2 + x_n}{2} < \frac{x_3 + x_n}{2} < \cdots < \frac{x_{n-1} + x_n}{2} $$ representan $(n - 1) + (n - 2) = 2n - 3$ elementos distintos de $A_S$, así que $A_S$ tiene al menos $2n - 3$ elementos distintos. Por otro lado, si tomamos $S = \{1, 2, \dots, n\}$, los elementos de $A_S$ son $\frac{3}{2}, \frac{4}{2}, \frac{5}{2}, \dots, \frac{2n - 1}{2}$: hay solo $(2n - 1) - 2 = 2n - 3$ de esos números. Así, existe un conjunto $A_S$ con a lo más $\boxed{2n - 3}$ elementos distintos, lo cual completa la demostración.`),
  putnam('PUTNAM-1992-B3', 1992, 'B', 3, 'Región de convergencia de una recursión cuadrática con parámetro y', 'Geometría',
    String.raw`Para cualquier par $(x, y)$ de números reales, se define una sucesión $(a_n(x,y))_{n\geq 0}$ como sigue: $$ a_0(x, y) = x, \qquad a_{n+1}(x, y) = \frac{(a_n(x, y))^2 + y^2}{2}, \quad \text{para } n \geq 0. $$ Encuentra el área de la región $$ \{ (x, y) \mid (a_n(x,y))_{n \geq 0} \text{ converge} \}. $$`,
    String.raw`La región de convergencia es un cuadrado (cerrado) $\{(x, y) : -1 \leq x, y \leq 1\}$ de lado 2, con semicírculos (cerrados) de radio 1 centrados en $(\pm 1, 0)$ descritos sobre dos lados opuestos. Si $\lim_{n \to \infty} a_n(x, y) = L$, entonces $L$ debe satisfacer $L = \frac{L^2 + y^2}{2}$, es decir, $L$ debe ser raíz de $$ r^2 - 2r + y^2 = 0. \quad (1) $$ En tal caso, la ecuación debe tener raíces reales, así que el discriminante, $4 - 4y^2$, debe ser no negativo. Así, una condición necesaria para que $(a_n(x, y))$ converja es que $|y| \leq 1$. Fija $|y| \leq 1$. Las raíces de (1) son entonces $1 - \sqrt{1 - y^2}$ y $1 + \sqrt{1 - y^2}$, que son reales y no negativas. Como $a_1(-x, y) = a_1(x, y)$, el intervalo de convergencia es simétrico respecto a $x = 0$. Supondremos entonces que $x \geq 0$, así que $a_n(x, y) \geq 0$ para todo $n$. Si $r_0 = 1 \pm \sqrt{1 - y^2}$, entonces $a_{n+1}(x, y)$ es menor, igual o mayor que $r_0$ según si $a_n(x, y)$ es menor, igual o mayor que $r_0$ ($= \frac{r_0^2 + y^2}{2}$). Si $a_n(x, y)$ está en el intervalo cerrado $[1 - \sqrt{1 - y^2}, 1 + \sqrt{1 - y^2}]$, es decir, entre las raíces de (1), entonces $$ (a_n(x, y))^2 - 2a_n(x, y) + y^2 \leq 0, $$ así que $$ 1 - \sqrt{1 - y^2} \leq a_{n+1}(x, y) \leq a_n(x, y). $$ Se sigue que $(a_n(x, y))_{n \geq 0}$ converge si $x$ está en el intervalo cerrado $[1 - \sqrt{1 - y^2}, 1 + \sqrt{1 - y^2}]$. Si $a_n(x, y)$ no está en ese intervalo, entonces $$ (a_n(x, y))^2 - 2a_n(x, y) + y^2 > 0, $$ así que $$ a_{n+1}(x, y) > a_n(x, y). $$ Por lo tanto, si $x$ (y por lo tanto todos los $a_n(x, y)$) es mayor que $1 + \sqrt{1 - y^2}$, la sucesión diverge. Por otro lado, si $x$ (y por lo tanto todos los $a_n(x, y)$) está entre 0 y $1 - \sqrt{1 - y^2}$, la sucesión converge monótonamente a $1 - \sqrt{1 - y^2}$. En resumen, $(a_n(x, y))_{n \geq 0}$ converge si y solo si $$ -1 \leq y \leq 1 \quad \text{y} \quad -\left(1 + \sqrt{1 - y^2}\right) \leq x \leq 1 + \sqrt{1 - y^2}. $$ El área es $\boxed{4 + \pi}$.`),
  putnam('PUTNAM-1992-B4', 1992, 'B', 4, 'Grado mínimo de f en la derivada 1992 de p(x)/(x³−x)', 'Álgebra',
    String.raw`Sea $p(x)$ un polinomio no nulo de grado menor que 1992 que no tiene ningún factor no constante en común con $x^3 - x$. Sea $$ \frac{d^{1992}}{dx^{1992}} \left( \frac{p(x)}{x^3 - x} \right) = \frac{f(x)}{g(x)} $$ para polinomios $f(x)$ y $g(x)$. Encuentra el menor grado posible de $f(x)$.`,
    String.raw`Por el algoritmo de la división, podemos escribir $p(x) = (x^3 - x)q(x) + r(x)$, donde $q(x)$ y $r(x)$ son polinomios, el grado de $r(x)$ es menor que 3, y el grado de $q(x)$ es menor que 1990. Entonces $$ \frac{d^{1992}}{dx^{1992}} \left( \frac{p(x)}{x^3 - x} \right) = \frac{d^{1992}}{dx^{1992}} \left( \frac{r(x)}{x^3 - x} \right). $$ Ahora, escribe $r(x)/(x^3 - x)$ en la forma $$ \frac{A}{x - 1} + \frac{B}{x} + \frac{C}{x + 1}. $$ Como $p(x)$ y $x^3 - x$ no tienen ningún factor común no constante, tampoco lo tienen $r(x)$ y $x^3 - x$, y por lo tanto $ABC \neq 0$. Así, $$ \frac{d^{1992}}{dx^{1992}} \left( \frac{r(x)}{x^3 - x} \right) = 1992! \left( \frac{A}{(x - 1)^{1993}} + \frac{B}{x^{1993}} + \frac{C}{(x + 1)^{1993}} \right), $$ que al escribirse sobre un común denominador tiene numerador $$ Ax^{1993}(x + 1)^{1993} + B(x - 1)^{1993}(x + 1)^{1993} + C(x - 1)^{1993}x^{1993}. $$ Como $ABC \neq 0$, es claro que el numerador y el denominador no tienen factor común. Expandiendo el numerador se obtiene una expresión de la forma $$ (A + B + C)x^{3986} + 1993(A - C)x^{3985} + 1993(996A - B + 996C)x^{3984} + \cdots. $$ Con $A = C = 1$, $B = -2$, vemos que el grado puede ser tan bajo como 3984. Un grado menor implicaría $A + B + C = 0$, $A - C = 0$, $996A - B + 996C = 0$, lo que forzaría $A = B = C = 0$, una contradicción. Por lo tanto, el menor grado posible de $f(x)$ es $\boxed{3984}$.`),
  putnam('PUTNAM-1992-B6', 1992, 'B', 6, 'Cota n² para un conjunto de matrices con conmutación restringida', 'Álgebra Lineal',
    String.raw`Sea $\mathcal{M}$ un conjunto de matrices reales de $n \times n$ tal que (i) $I \in \mathcal{M}$, donde $I$ es la matriz identidad de $n \times n$; (ii) si $A \in \mathcal{M}$ y $B \in \mathcal{M}$, entonces $AB \in \mathcal{M}$ o $-AB \in \mathcal{M}$, pero no ambos; (iii) si $A \in \mathcal{M}$ y $B \in \mathcal{M}$, entonces $AB = BA$ o $AB = -BA$; (iv) si $A \in \mathcal{M}$ y $A \neq I$, existe al menos un $B \in \mathcal{M}$ tal que $AB = -BA$. Demuestra que $\mathcal{M}$ contiene a lo más $n^2$ matrices.`,
    String.raw`Demostramos el resultado de manera más general para matrices complejas (porque conviene usar $i = \sqrt{-1}$ en la demostración). La demostración es por inducción en $n$. Si $n = 1$, los elementos de $\mathcal{M}$ conmutan, así que (iv) no puede satisfacerse a menos que $\mathcal{M} = \{I\}$. Supón que $n > 1$ y que el resultado se cumple para conjuntos de matrices complejas de dimensión menor. Podemos suponer $|\mathcal{M}| > 1$, así que por (iv), existen $C, D \in \mathcal{M}$ con $CD = -DC$. Fija esos $C, D$. Como antes, $C^2 = \pm I$. Por lo tanto los valores propios de $C$ son $\pm\lambda$, donde $\lambda = 1$ o $i$. Además, $\mathbb{C}^n = V_{\lambda} \oplus V_{-\lambda}$, donde $V_{\lambda}, V_{-\lambda}$ son los núcleos de $(C - \lambda I)$ y $(C + \lambda I)$ respectivamente. Observamos que si $X \in \mathcal{M}$, entonces $$ CX = XC \implies (C + \lambda I)X = X(C + \lambda I) \implies XV_{\pm\lambda} = V_{\pm\lambda}, $$ $$ CX = -XC \implies XV_{\pm\lambda} = V_{\mp\lambda}. $$ En particular, como $DV_{\lambda} = V_{-\lambda}$, se tiene $\dim(V_{\lambda}) = \dim(V_{-\lambda}) = n/2$. Sea $\mathcal{N} = \{X \in \mathcal{M} \mid CX = XC,\ DX = XD\}$. Si $Y \in \mathcal{M}$, entonces exactamente uno de $Y, YC, YD, YCD$ está en $\mathcal{N}$. Se sigue que $|\mathcal{M}| = 4|\mathcal{N}|$. Para $X \in \mathcal{N}$, sea $\phi(X)$ la matriz de $n/2 \times n/2$ que representa, respecto a una base fija de $V_{\lambda}$, la transformación lineal $v \mapsto vX$ para $v \in V_{\lambda}$. Entonces $\phi$ es inyectiva: si $\phi(X) = \phi(Y)$, entonces $vX = vY$ para $v \in V_{\lambda}$; pero si $v \in V_{-\lambda}$, entonces $vD = vDX = vDY = vYD$, lo cual también da $vX = vY$; como $X, Y$ inducen la misma transformación tanto en $V_{\lambda}$ como en $V_{-\lambda}$, se sigue que $X = Y$. Basta entonces mostrar que $\phi(\mathcal{N})$, un conjunto de matrices complejas de $n/2 \times n/2$, satisface (i), (ii), (iii), (iv), pues entonces, por inducción, $|\phi(\mathcal{N})| \leq (n/2)^2$, de donde $|\mathcal{M}| = 4|\mathcal{N}| = 4|\phi(\mathcal{N})| \leq n^2$. Las condiciones (i), (ii), (iii) para $\phi(\mathcal{N})$ se heredan claramente de las de $\mathcal{M}$. Para mostrar (iv), sea $\phi(A) \in \phi(\mathcal{N})$, con $\phi(A)$ distinta de la matriz identidad de $n/2 \times n/2$. Entonces $A \neq I$ (ya que $\phi$ es inyectiva), y $AB = -BA$ para algún $B \in \mathcal{M}$. Sea $B'$ el elemento de $\{B, BC, BD, BCD\}$ que pertenece a $\mathcal{N}$. Como $AB' = -B'A$, se tiene $\phi(A)\phi(B') = -\phi(B')\phi(A)$. Por lo tanto $\mathcal{M}$ contiene a lo más $\boxed{n^2}$ matrices.`),
]

const putnam1993 = [
  putnam('PUTNAM-1993-A1', 1993, 'A', 1, 'Valor c que iguala áreas bajo y=2x−3x³', 'Álgebra',
    String.raw`La recta horizontal $y=c$ interseca la curva $y = 2x - 3x^3$ en el primer cuadrante formando dos regiones: la primera acotada por el eje $y$, la recta $y=c$ y la curva; la segunda bajo la curva y sobre la recta $y=c$ entre sus dos puntos de intersección. Encuentra $c$ de modo que las áreas de ambas regiones sean iguales.`,
    String.raw`Sea $(b, c)$ el segundo punto de intersección. Queremos encontrar $c$ tal que $$ \int_0^b \left( c - \left(2x - 3x^3 \right) \right) dx = 0. $$ Esto lleva a $cb - b^2 + \frac{3}{4}b^4 = 0$. Sustituyendo $c = 2b - 3b^3$ y resolviendo, encontramos que $b = 2/3$, y el resultado se sigue. El valor de $c$ es $\boxed{4/9}$.`),
  putnam('PUTNAM-1993-A6', 1993, 'A', 6, "Sucesión autodescriptiva de 2's y 3's y una fórmula con piso", 'Teoría de Números',
    String.raw`La sucesión infinita de 2's y 3's $$ 2,3,3,2,3,3,3,2,3,3,3,2,3,3,2,3,3,3,2,3,3,3,2,3,3,3,2,3,3,2,3,3,3,2,\dots $$ tiene la propiedad de que, si se forma una segunda sucesión que registra el número de 3's entre 2's sucesivos, el resultado es idéntico a la sucesión dada. Demuestra que existe un número real $r$ tal que, para cualquier $n$, el $n$-ésimo término de la sucesión es 2 si y solo si $n = 1 + \lfloor rm \rfloor$ para algún entero no negativo $m$. (Nota: $\lfloor x \rfloor$ denota el mayor entero menor o igual a $x$.)`,
    String.raw`Suponiendo el resultado, primero derivamos el valor de $r$. Observa que, asintóticamente, la proporción de 2's en los primeros $n$ términos es $1/r$. Así, suponiendo que hay aproximadamente $m$ 2's en los primeros $n \approx rm$ términos, debería haber aproximadamente $(r - 1)m$ 3's. Estos números dan la cantidad aproximada de 3's en los intervalos que siguen a los primeros $m$ 2's, a saber $2m + 3(r - 1)m = (3r - 1)m$. Por lo tanto, la proporción de 2's en los primeros $rm + (3r - 1)m = (4r - 1)m$ términos es $\frac{rm}{(4r - 1)m} = \frac{r}{4r - 1}$. Así que queremos que $r$ satisfaga $\frac{1}{r} = \frac{r}{4r - 1}$, es decir, $r^2 - 4r + 1 = 0$. Como $r$ debe ser mayor que 1, $r = \boxed{2 + \sqrt{3}}$.`),
  putnam('PUTNAM-1993-B1', 1993, 'B', 1, 'Menor n para que k/n aproxime cualquier fracción m/1993', 'Teoría de Números',
    String.raw`Encuentra el menor entero positivo $n$ tal que para todo entero $m$ con $0 < m < 1993$, existe un entero $k$ para el cual $$ \frac{m}{1993} < \frac{k}{n} < \frac{m+1}{1994}. $$`,
    String.raw`Primero, se verifica fácilmente que $$ \frac{m}{1993} < \frac{2m + 1}{1993 + 1994} < \frac{m + 1}{1994}, $$ así que $n = 1993 + 1994 = 3987$ es suficiente. Ahora considera $m = 1992$ y supón $$ \frac{1992}{1993} < \frac{k}{n} < \frac{1993}{1994}. $$ Como $x/(x + 1)$ es estrictamente creciente para $x > 0$, debemos tener $k \leq n - 2$ (nota: $n > 1994$). Sin embargo, $$ \frac{1992}{1993} < \frac{n - 2}{n} $$ implica $3986 < n$, así que $n \geq \boxed{3987}$, lo cual completa la demostración.`),
  putnam('PUTNAM-1993-B2', 1993, 'B', 2, 'Probabilidad de ganar un juego de descarte módulo 2n+1', 'Teoría de Números',
    String.raw`Considera el siguiente juego con una baraja de $2n$ cartas numeradas del 1 al $2n$. La baraja se baraja al azar y se reparten $n$ cartas a cada uno de dos jugadores. Comenzando con $A$, los jugadores se turnan para descartar una de sus cartas restantes y anunciar su número. El juego termina en cuanto la suma de los números de las cartas descartadas es divisible entre $2n+1$. La última persona en descartar gana el juego. Suponiendo estrategia óptima de $A$ y de $B$, ¿cuál es la probabilidad de que $A$ gane?`,
    String.raw`Claramente, $A$ no puede ganar en el primer turno. Supón que le toca jugar a $B$, que el total de números anunciados es $T$, que $A$ tiene las cartas $x_1, x_2, \dots, x_k$, y que $B$ tiene las cartas $y_1, y_2, \dots, y_{k+1}$. Como los enteros $T + y_1, \dots, T + y_{k+1}$ tienen residuos distintos al dividirse entre $2n + 1$, al menos uno tiene un residuo distinto de $2n + 1 - x_1, \dots, 2n + 1 - x_k$. Si $B$ descarta esa $y_i$, es imposible que el siguiente descarte de $A$ haga que el total sea divisible entre $2n + 1$. Por lo tanto, $A$ no puede ganar bajo juego óptimo de $B$. La probabilidad de que $A$ gane es $\boxed{0}$.`),
  putnam('PUTNAM-1993-B3', 1993, 'B', 3, 'Probabilidad de que el entero más cercano a x/y sea par', 'Probabilidad',
    String.raw`Se eligen al azar dos números reales $x$ y $y$ en el intervalo $(0,1)$ con distribución uniforme. ¿Cuál es la probabilidad de que el entero más cercano a $x/y$ sea par? Expresa la respuesta en la forma $r+s\pi$, donde $r$ y $s$ son racionales.`,
    String.raw`El límite es $(5 - \pi)/4$ (es decir, $r = 5/4$, $s = -1/4$). Observa que la probabilidad de que $x/y$ sea exactamente la mitad de un entero impar es 0, así que podemos ignorar esa posibilidad con seguridad. Para cualquier elección de $x$, el entero más cercano a $x/y$ es par si $x/y < 0.5$ o si $2n - 0.5 < x/y < 2n + 0.5$ para algún entero positivo $n$. El evento $x/y < 0.5$, o $2x < y$, solo puede ocurrir si $x < 0.5$. Así, su probabilidad es $$ \int_0^{0.5} \left(1 - 2x\right) dx = \frac{1}{4}. $$ Para un entero positivo $n$, la probabilidad de que $2n - 0.5 < x/y < 2n + 0.5$, es decir, que $\frac{2x}{4n + 1} < y < \frac{2x}{4n - 1}$, es $$ \int_0^1 \left( \frac{2x}{4n - 1} - \frac{2x}{4n + 1} \right) dx = \frac{1}{4n - 1} - \frac{1}{4n + 1}. $$ Sumando desde $n = 1$ hasta $\infty$, obtenemos $$ \sum_{k=1}^{\infty} \left(-1\right)^{k+1} \frac{1}{2k + 1} = 1 - \arctan 1 = 1 - \frac{\pi}{4}. $$ La probabilidad total es entonces $\frac{1}{4} + 1 - \frac{\pi}{4} = \boxed{\frac{5 - \pi}{4}}$.`),
]

const putnam1994 = [
  putnam('PUTNAM-1994-A2', 1994, 'A', 2, 'Valor m que iguala áreas en una elipse mediante transformación lineal', 'Geometría',
    String.raw`Sea $A$ el área de la región en el primer cuadrante acotada por la recta $y = \frac{1}{2}x$, el eje $x$, y la elipse $\frac{1}{9}x^2 + y^2 = 1$. Encuentra el número positivo $m$ tal que $A$ es igual al área de la región en el primer cuadrante acotada por la recta $y = mx$, el eje $y$, y la elipse $\frac{1}{9}x^2 + y^2 = 1$.`,
    String.raw`La transformación lineal dada por $x_1 = \frac{1}{3}x$, $y_1 = y$ transforma la región $R$ acotada por $y = \frac{1}{2}x$, el eje $x$, y la elipse $\frac{1}{9}x^2 + y^2 = 1$ en la región $R'$ acotada por $y_1 = \frac{3}{2}x_1$, el eje $x_1$, y el círculo $x_1^2 + y_1^2 = 1$; también transforma la región $S$ acotada por $y = mx$, el eje $y$, y la elipse, en la región $S'$ acotada por $y_1 = 3mx_1$, el eje $y_1$, y el círculo. Como todas las áreas se multiplican por el mismo factor (no nulo) bajo la transformación, $R$ y $S$ tienen la misma área si y solo si $R'$ y $S'$ tienen la misma área. Pero, por simetría respecto a la recta $y_1 = x_1$, esto ocurre si y solo si $3m = \frac{2}{3}$, es decir, $m = \boxed{\frac{2}{9}}$.`),
  putnam('PUTNAM-1994-A4', 1994, 'A', 4, 'Invertibilidad entera de A+5B dado cinco invertibles consecutivos', 'Teoría de Números',
    String.raw`Sean $A$ y $B$ matrices de $2 \times 2$ con entradas enteras tales que $A, A+B, A+2B, A+3B$ y $A+4B$ son todas matrices invertibles cuyas inversas tienen entradas enteras. Demuestra que $A+5B$ es invertible y que su inversa tiene entradas enteras.`,
    String.raw`Una matriz $C$ con entradas enteras tiene una inversa con entradas enteras si y solo si $\det C = \pm 1$. Por lo tanto, si consideramos la función $f$ definida por $f(x) = \det(A + xB)$, sabemos que los cinco valores $f(0)$, $f(1)$, $f(2)$, $f(3)$ y $f(4)$ deben ser todos $1$ o $-1$, así que $f$ toma alguno de esos valores tres veces o más. Sin embargo, $f(x)$ es un polinomio de grado a lo más 2 en $x$, y un polinomio así solo puede tomar un valor más de dos veces si es constante. Por lo tanto $f(x)$ es una de las constantes $1$ o $-1$; en particular, $\boxed{\det(A + 5B) = \pm 1}$, así que $A + 5B$ tiene una inversa con entradas enteras.`),
  putnam('PUTNAM-1994-A6', 1994, 'A', 6, 'A lo más 512 de 1024 composiciones fijan un conjunto finito', 'Combinatoria',
    String.raw`Sean $f_1, \dots, f_{10}$ biyecciones del conjunto de los enteros tales que, para cada entero $n$, existe alguna composición $f_{i_1} \circ f_{i_2} \circ \cdots \circ f_{i_m}$ de estas funciones (permitiendo repeticiones) que envía 0 a $n$. Considera el conjunto de 1024 funciones $$ \mathcal{F} = \{f_1^{e_1} \circ f_2^{e_2} \circ \cdots \circ f_{10}^{e_{10}}\}, $$ con $e_i = 0$ o $1$ para $1 \leq i \leq 10$ ($f_i^0$ es la función identidad y $f_i^1 = f_i$). Demuestra que si $A$ es cualquier conjunto finito no vacío de enteros, entonces a lo más 512 de las funciones en $\mathcal{F}$ envían $A$ a sí mismo.`,
    String.raw`Sea $A$ un subconjunto finito no vacío de los enteros $\mathbb{Z}$. Por el principio del palomar, cualquier biyección de $\mathbb{Z}$ que envíe $A$ a sí mismo debe ser una biyección al restringirse a $A$; en particular, su inversa también envía $A$ a sí mismo. Observa que no todas las biyecciones $f_1, f_2, \dots, f_{10}$ pueden enviar $A$ a sí mismo, pues de lo contrario, si $0 \in A$, no podríamos enviar 0 a ningún $n \notin A$ mediante una composición $f_{i_1} \circ f_{i_2} \circ \cdots \circ f_{i_m}$, mientras que si $0 \notin A$, no podríamos enviar 0 a ningún $n \in A$ mediante tal composición. Sea $k$ el menor entero tal que $f_k$ no envía $A$ a sí mismo, y supón que más de 512 de las funciones de $\mathcal{F}$ envían $A$ a sí mismo. Podemos escribir $\mathcal{F}$ como una unión disjunta de pares no ordenados de funciones, de modo que dos composiciones $f_1^{e_1} \circ \cdots \circ f_{10}^{e_{10}}$ y $f_1^{d_1} \circ \cdots \circ f_{10}^{d_{10}}$ están en el mismo par cuando difieren únicamente en el $k$-ésimo exponente, es decir, cuando $e_i = d_i$ para $i \neq k$. Por el principio del palomar, hay entonces al menos uno de estos 512 pares en el cual ambas funciones envían $A$ a sí mismo. Como todas las $f_l$ con $l > k$ también envían $A$ a sí mismo, podemos usar composición con las inversas de las $f_l$ necesarias para concluir que, para algunos $e_1, \dots, e_{k-1}$, las funciones $F_1 = f_1^{e_1} \circ \cdots \circ f_{k-1}^{e_{k-1}} \circ f_k$ y $F_2 = f_1^{e_1} \circ \cdots \circ f_{k-1}^{e_{k-1}}$ ambas envían $A$ a sí mismo. Pero entonces $F_1^{-1} \circ F_2 = f_k^{-1}$ también envía $A$ a sí mismo, una contradicción. Por lo tanto, a lo más $\boxed{512}$ de las funciones en $\mathcal{F}$ envían $A$ a sí mismo.`),
  putnam('PUTNAM-1994-B1', 1994, 'B', 1, 'Enteros a distancia 250 de exactamente 15 cuadrados perfectos', 'Teoría de Números',
    String.raw`Encuentra todos los enteros positivos $n$ que están a distancia 250 de exactamente 15 cuadrados perfectos.`,
    String.raw`Supón que $N > 0$ está a distancia 250 de los 15 cuadrados $m^2, (m+1)^2, \ldots, (m+14)^2$, donde podemos tomar $m \geq 0$. De hecho, $m$ resultará ser positivo, pues de lo contrario $N$ estaría a distancia 250 del cuadrado adicional $225$. Tenemos las condiciones necesarias y suficientes $$ (m + 14)^2 \leq N + 250 \leq (m + 15)^2 - 1, \qquad (m - 1)^2 + 1 \leq N - 250 \leq m^2. $$ Restando (invirtiendo las desigualdades de la segunda línea), obtenemos $$ 28m + 196 \leq 500 \leq 32m + 222, $$ lo cual implica $m = 9$ o $m = 10$. Si $m = 9$: $$ 23^2 \leq N + 250 \leq 24^2 - 1, \qquad 8^2 + 1 \leq N - 250 \leq 9^2, $$ es decir, $315 \leq N \leq 325$. Si $m = 10$: $$ 24^2 \leq N + 250 \leq 25^2 - 1, \qquad 9^2 + 1 \leq N - 250 \leq 10^2, $$ es decir, $332 \leq N \leq 350$. Por lo tanto, los enteros buscados son $\boxed{315 \leq N \leq 325 \text{ o } 332 \leq N \leq 350}$.`),
  putnam('PUTNAM-1994-B2', 1994, 'B', 2, 'Valores de c para que una recta corte la cuártica en 4 puntos', 'Álgebra',
    String.raw`¿Para qué números reales $c$ existe una recta que interseca la curva $$ x^4 + 9x^3 + cx^2 + 9x + 4 $$ en cuatro puntos distintos?`,
    String.raw`El término constante y el coeficiente de $x$ en un cuártico $p(x)$ son irrelevantes para determinar si existe una recta que interseque $y = p(x)$ en cuatro puntos. También podemos reemplazar $p(x)$ por $p(x - \alpha)$ para cualquier real $\alpha$. Así, podemos reemplazar el cuártico dado $p(x) = x^4 + 9x^3 + cx^2 + 9x + 4$ por $p(x - 9/4) = x^4 + (c - 243/8)x^2 + \cdots$, y descartar los últimos dos coeficientes (nunca necesitamos calcularlos). El problema entonces es determinar los valores de $c$ para los cuales existe una recta que interseque $y = x^4 + (c - 243/8)x^2$ en cuatro puntos distintos. El resultado es evidente a partir de la forma de las curvas $y = x^4 + ax^2$: cuando $a < 0$, esta curva en forma de "W" tiene un máximo relativo en $x = 0$, así que rectas horizontales $y = -\varepsilon$ para $\varepsilon$ positivo pequeño intersecan la curva en cuatro puntos; mientras que para $a \geq 0$, la curva siempre es cóncava hacia arriba, así que ninguna recta puede intersecarla en más de dos puntos. Por lo tanto, la condición se cumple exactamente cuando $\boxed{c < 243/8}$.`),
  putnam('PUTNAM-1994-B3', 1994, 'B', 3, "Conjunto de k tales que f'>f implica f(x)>e^{kx} eventualmente", 'Análisis',
    String.raw`Encuentra el conjunto de todos los números reales $k$ con la siguiente propiedad: para cualquier función $f$ positiva y diferenciable que satisface $f'(x) > f(x)$ para todo $x$, existe algún número $N$ tal que $f(x) > e^{kx}$ para todo $x > N$.`,
    String.raw`Para mostrar esto, primero observa que si $k > 1$ estuviera en el conjunto, entonces $k = 1$ también lo estaría. Sin embargo, si $f$ es cualquier función de la forma $f(x) = g(x)e^x$, donde $g$ es una función positiva, creciente, diferenciable y acotada entre 0 y 1 (por ejemplo, $g(x) = \frac{1}{\pi}\arctan x + \frac{1}{2}$), tenemos $f'(x) = e^x(g'(x) + g(x)) > f(x)$ y $f(x) < e^x$ para todo $x$, así que $k = 1$ no está en el conjunto. Por otro lado, si $f'(x) > f(x)$ para todo $x$, entonces (como $f$ es positiva) $$ \frac{f'(x)}{f(x)} > 1 \quad \text{para todo } x, $$ $$ \int_0^x \frac{f'(t)}{f(t)} dt > \int_0^x 1\, dt \quad \text{para todo } x \geq 0, $$ $$ \log(f(x)) > x + \log(f(0)) \quad \text{para todo } x \geq 0, $$ $$ f(x) > f(0)e^x \quad \text{para todo } x \geq 0. $$ Si $k$ es cualquier número menor que 1, entonces para $x$ suficientemente grande tendremos $f(0)e^x > e^{kx}$ (ya que $f(0)$ es positivo), lo cual muestra que $k$ está en el conjunto. Por lo tanto, el conjunto deseado es $\boxed{(-\infty, 1)}$.`),
  putnam('PUTNAM-1994-B4', 1994, 'B', 4, 'El mcd de las entradas de Aⁿ−I tiende a infinito', 'Teoría de Números',
    String.raw`Para $n \geq 1$, sea $d_n$ el máximo común divisor de las entradas de $A^n - I$, donde $$ A = \begin{pmatrix} 3 & 2 \\ 4 & 3 \end{pmatrix} \quad \text{e} \quad I = \begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix}. $$ Demuestra que $\lim_{n \to \infty} d_n = \infty$.`,
    String.raw`Por experimentación (y luego una inducción sencilla en $n$) vemos que $A^n$ tiene la forma $$ A^n = \begin{pmatrix} a_n & b_n \\ 2b_n & a_n \end{pmatrix} $$ con $a_n$ impar, y, como $\det A^n = 1$, tenemos $a_n^2 - 1 = 2b_n^2$. Así, $a_n - 1$ divide a $2b_n^2$, de modo que $d_n = \gcd(a_n - 1, b_n) \geq \sqrt{(a_n - 1)/2}$. Como $\lim_{n \to \infty} a_n = \infty$ (por ejemplo, $a_n > 3a_{n-1}$), el resultado se sigue: $\lim_{n \to \infty} d_n = \boxed{\infty}$.`),
]

const putnam2021 = [
  putnam('PUTNAM-2021-A1', 2021, 'A', 1, 'Saltos mínimos de un saltamontes a (2021, 2021)', 'Teoría de Números', String.raw`Un saltamontes comienza en el origen en el plano coordenado y realiza una secuencia de saltos. Cada salto tiene longitud 5, y después de cada salto el saltamontes se encuentra en un punto cuyas coordenadas son ambas enteros; por lo tanto, hay 12 ubicaciones posibles para el saltamontes después del primer salto. ¿Cuál es el número mínimo de saltos necesarios para que el saltamontes alcance el punto $(2021, 2021)$?`),
  putnam('PUTNAM-2021-A2', 2021, 'A', 2, 'Límite de g(x)/x definida por un límite en r', 'Análisis', String.raw`Para cada número real positivo $x$, sea $g(x) = \lim_{r\to 0} \left((x+1)^{r+1} - x^{r+1}\right)^{\frac{1}{r}}$. Encuentra $\lim_{x\to\infty} \frac{g(x)}{x}$.`),
  putnam('PUTNAM-2021-A3', 2021, 'A', 3, 'Esfera con tetraedro regular de vértices enteros', 'Geometría', String.raw`Determina todos los enteros positivos $N$ para los cuales la esfera $x^2+y^2+z^2=N$ tiene inscrito un tetraedro regular cuyos vértices tienen coordenadas enteras.`),
  putnam('PUTNAM-2021-A4', 2021, 'A', 4, 'Límite de una integral doble con simetría', 'Análisis', String.raw`Sea $I(R) = \iint_{x^2+y^2\le R^2} \left(\frac{1+2x^2}{1+x^4+6x^2y^2+y^4} - \frac{1+y^2}{2+x^4+y^4}\right) dxdy$. Encuentra $\lim_{R\to\infty} I(R)$ o demuestra que este límite no existe.`),
  putnam('PUTNAM-2021-A5', 2021, 'A', 5, 'Sumas de potencias módulo 2021', 'Teoría de Números', String.raw`Sea $A$ el conjunto de todos los enteros $n$ tales que $1 \le n \le 2021$ y $\operatorname{mcd}(n,2021)=1$. Para cada entero no negativo $j$, sea $S(j) = \sum_{n\in A} n^j$. Determina todos los valores de $j$ tales que $S(j)$ es un múltiplo de $2021$.`),
  putnam('PUTNAM-2021-A6', 2021, 'A', 6, '¿Es P(2) compuesto si P(x) factoriza?', 'Álgebra', String.raw`Sea $P(x)$ un polinomio cuyos coeficientes son todos $0$ o $1$. Supón que $P(x)$ se puede escribir como el producto de dos polinomios no constantes con coeficientes enteros. ¿Se sigue de esto que $P(2)$ es un entero compuesto?`),
  putnam('PUTNAM-2021-B1', 2021, 'B', 1, 'Probabilidad de no cubrir esquinas del tablero', 'Probabilidad', String.raw`Supón que el plano está embaldosado con un tablero de ajedrez infinito de cuadrados unitarios. Si se deja caer otro cuadrado unitario sobre el plano al azar con posición y orientación independientes del embaldosado del tablero de ajedrez, ¿cuál es la probabilidad de que no cubra ninguna de las esquinas de los cuadrados del tablero de ajedrez?`),
  putnam('PUTNAM-2021-B2', 2021, 'B', 2, 'Máximo de una suma con media geométrica', 'Análisis', String.raw`Determina el valor máximo de la suma $S = \sum_{n=1}^{\infty} \frac{n}{2^n} (a_1 a_2 \dots a_n)^{\frac{1}{n}}$ sobre todas las sucesiones $a_1, a_2, a_3, \dots$ de números reales no negativos que satisfacen $\sum_{k=1}^{\infty} a_k = 1$.`),
  putnam('PUTNAM-2021-B3', 2021, 'B', 3, 'Círculo donde la integral de ρ se anula', 'Análisis', String.raw`Sea $h(x,y)$ una función de valor real que es dos veces continuamente diferenciable en todo $\mathbb{R}^2$ y define $\rho(x,y) = yh_x - xh_y$. Pruebe o refute: Para cualquier constante positiva $d$ y $r$ con $d > r$, existe un círculo $S$ de radio $r$ cuyo centro está a una distancia $d$ del origen tal que la integral de $\rho$ sobre el interior de $S$ es cero.`),
  putnam('PUTNAM-2021-B4', 2021, 'B', 4, 'Residuo de un producto módulo un Fibonacci', 'Teoría de Números', String.raw`Sean $F_0, F_1, \dots$ la sucesión de números de Fibonacci, con $F_0=0$, $F_1=1$, y $F_n = F_{n-1} + F_{n-2}$ para $n \ge 2$. Para $m > 2$, sea $R_m$ el residuo cuando el producto $\prod_{k=1}^{m-1} k^k$ se divide por $F_m$. Demuestra que $R_m$ también es un número de Fibonacci.`),
  putnam('PUTNAM-2021-B5', 2021, 'B', 5, 'Potencias de una matriz "muy impar"', 'Álgebra Lineal', String.raw`Se dice que una matriz de $n \times n$ con entradas enteras es muy impar si, para cada subconjunto no vacío $S$ de $\{1, 2, \dots, n\}$, la submatriz de $|S| \times |S|$ $(a_{ij})_{i,j\in S}$ tiene determinante impar. Demuestra que si $A$ es muy impar, entonces $A^k$ es muy impar para todo $k \ge 1$.`),
  putnam('PUTNAM-2021-B6', 2021, 'B', 6, 'Cota para el valor esperado tras recortar medianas', 'Probabilidad', String.raw`Dada una lista ordenada de $3N$ números reales, podemos recortarla para formar una lista de $N$ números de la siguiente manera: dividimos la lista en $N$ grupos de 3 números consecutivos, y dentro de cada grupo, descartamos el número más alto y el más bajo, conservando solo la mediana. Considera generar un número aleatorio $X$ mediante el siguiente procedimiento: comienza con una lista de $3^{2021}$ números, extraídos independiente y uniformemente al azar entre 0 y 1. Luego recorta esta lista como se definió anteriormente, dejando una lista de $3^{2020}$ números. Luego recorta nuevamente de forma repetida hasta que solo quede un número; sea $X$ este número. Sea $\mu$ el valor esperado de $|X - 1/2|$. Muestra que $\mu \ge \frac{1}{4} \left(\frac{2}{3}\right)^{2021}$.`),
]

const putnam2022 = [
  putnam('PUTNAM-2022-A1', 2022, 'A', 1, 'Recta tangente única a ln(1+x²)', 'Análisis', String.raw`Determina todos los pares ordenados de números reales $(a, b)$ tales que la recta $y = ax + b$ interseca a la curva $y = \ln(1+x^2)$ en exactamente un punto.`),
  putnam('PUTNAM-2022-A2', 2022, 'A', 2, 'Coeficientes negativos máximos de p(x)²', 'Álgebra', String.raw`Sea $n$ un entero con $n \ge 2$. Sobre todos los polinomios reales $p(x)$ de grado $n$, ¿cuál es el mayor número posible de coeficientes negativos de $p(x)^2$?`),
  putnam('PUTNAM-2022-A3', 2022, 'A', 3, 'Sucesiones módulo p y una congruencia módulo 5', 'Teoría de Números', String.raw`Sea $p$ un número primo mayor que 5. Sea $f(p)$ el número de sucesiones infinitas $a_1, a_2, a_3, \dots$ tales que $a_n \in \{1, 2, \dots, p-1\}$ y $a_n a_{n+2} \equiv 1 + a_{n+1} \pmod{p}$ para todo $n \ge 1$. Demuestra que $f(p)$ es congruente con 0 o 2 (mód 5).`),
  putnam('PUTNAM-2022-A4', 2022, 'A', 4, 'Valor esperado hasta la primera bajada', 'Probabilidad', String.raw`Supón que $X_1, X_2, \dots$ son números reales entre 0 y 1 elegidos independiente y uniformemente al azar. Sea $S = \sum_{i=1}^{k} X_i / 2^i$, donde $k$ es el menor entero positivo tal que $X_k < X_{k+1}$, o $k=\infty$ si no existe tal entero. Encuentra el valor esperado de $S$.`),
  putnam('PUTNAM-2022-A5', 2022, 'A', 5, 'Juego de fichas en una fila de 2022 casillas', 'Combinatoria', String.raw`Alice y Bob juegan un juego en un tablero que consiste en una fila de 2022 cuadrados consecutivos. Se turnan colocando fichas que cubren dos cuadrados adyacentes, jugando Alice primero. Por regla, una ficha no debe cubrir un cuadrado que ya esté cubierto por otra ficha. El juego termina cuando no se puede colocar ninguna ficha según esta regla. El objetivo de Alice es maximizar el número de cuadrados descubiertos cuando termina el juego; el objetivo de Bob es minimizarlo. ¿Cuál es el mayor número de cuadrados descubiertos que Alice puede asegurar al final del juego, sin importar cómo juegue Bob?`),
  putnam('PUTNAM-2022-A6', 2022, 'A', 6, 'Intervalos de potencias impares de longitud igual', 'Análisis', String.raw`Sea $n$ un entero positivo. Determina, en términos de $n$, el entero más grande $M$ con la siguiente propiedad: Existen números reales $x_1, \dots, x_{2n}$ con $-1 < x_1 < x_2 < \dots < x_{2n} < 1$ tales que la suma de las longitudes de los $n$ intervalos $[x_1^{2k-1}, x_2^{2k-1}], [x_3^{2k-1}, x_4^{2k-1}], \dots, [x_{2n-1}^{2k-1}, x_{2n}^{2k-1}]$ es igual a 1 para todos los enteros $k$ con $1 \le k \le m$.`),
  putnam('PUTNAM-2022-B1', 2022, 'B', 1, 'Coeficientes de e^{P(x)} todos distintos de cero', 'Análisis', String.raw`Supón que $P(x) = a_1 x + a_2 x^2 + \dots + a_n x^n$ es un polinomio con coeficientes enteros, con $a_1$ impar. Supón que $e^{P(x)} = b_0 + b_1 x + b_2 x^2 + \dots$ para todo $x$. Demuestra que $b_k$ es distinto de cero para todo $k \ge 0$.`),
  putnam('PUTNAM-2022-B2', 2022, 'B', 2, 'Conjuntos cerrados bajo el producto cruz', 'Álgebra Lineal', String.raw`Sea $\times$ el producto vectorial en $\mathbb{R}^3$. ¿Para qué enteros positivos $n$ existe un conjunto $S \subset \mathbb{R}^3$ con exactamente $n$ elementos tal que $S = \{v \times w : v, w \in S\}$?`),
  putnam('PUTNAM-2022-B3', 2022, 'B', 3, 'Recoloreo iterado por distancias repetidas', 'Combinatoria', String.raw`Asigna a cada número real positivo un color, rojo o azul. Sea $D$ el conjunto de todas las distancias $d > 0$ tales que hay dos puntos del mismo color a una distancia $d$ de separación. Recolorea los reales positivos de modo que los números en $D$ sean rojos y los números que no están en $D$ sean azules. Si iteramos el proceso de recoloración, ¿terminaremos siempre con todos los números rojos después de un número finito de pasos?`),
  putnam('PUTNAM-2022-B4', 2022, 'B', 4, 'Progresiones aritméticas cíclicas de tres términos', 'Combinatoria', String.raw`Encuentra todos los enteros $n$ con $n \ge 4$ para los cuales existe una sucesión de números reales distintos $x_1, \dots, x_n$ tal que cada uno de los conjuntos $\{x_1, x_2, x_3\}, \{x_2, x_3, x_4\}, \dots, \{x_{n-2}, x_{n-1}, x_n\}, \{x_{n-1}, x_n, x_1\}, \text{ y } \{x_n, x_1, x_2\}$ forma una progresión aritmética de 3 términos cuando se ordena de forma creciente.`),
  putnam('PUTNAM-2022-B5', 2022, 'B', 5, 'Valor más probable de una suma aleatoria', 'Probabilidad', String.raw`Para $0 \le p \le 1/2$, sean $X_1, X_2, \dots$ variables aleatorias independientes tales que $X_i = 1$ con probabilidad $p$, $-1$ con probabilidad $p$, y $0$ con probabilidad $1-2p$, para todo $i \ge 1$. Dado un entero positivo $n$ y enteros $b, a_1, \dots, a_n$, sea $P(b, a_1, \dots, a_n)$ la probabilidad de que $a_1 X_1 + \dots + a_n X_n = b$. ¿Para qué valores de $p$ se cumple que $P(0, a_1, \dots, a_n) \ge P(b, a_1, \dots, a_n)$ para todos los enteros positivos $n$ y todos los enteros $b, a_1, \dots, a_n$?`),
  putnam('PUTNAM-2022-B6', 2022, 'B', 6, 'Ecuación funcional f(xf(y)) + f(yf(x)) = 1 + f(x+y)', 'Álgebra', String.raw`Encuentra todas las funciones continuas $f: \mathbb{R}^+ \to \mathbb{R}^+$ tales que $f(x f(y)) + f(y f(x)) = 1 + f(x+y)$ para todo $x, y > 0$.`),
]

const putnam2023 = [
  putnam('PUTNAM-2023-A1', 2023, 'A', 1, 'Segunda derivada de un producto de cosenos', 'Análisis', String.raw`Para un entero positivo $n$, sea $f_n(x) = \cos(x) \cos(2x) \cos(3x) \dots \cos(nx)$. Encuentra el $n$ más pequeño tal que $|f_n''(0)| > 2023$.`),
  putnam('PUTNAM-2023-A2', 2023, 'A', 2, 'Un polinomio que satisface p(1/k) = k²', 'Álgebra', String.raw`Sea $n$ un entero positivo par. Sea $p$ un polinomio real mónico de grado $2n$; es decir, $p(x) = x^{2n} + a_{2n-1}x^{2n-1} + \dots + a_1 x + a_0$ para algunos coeficientes reales $a_0, \dots, a_{2n-1}$. Supón que $p(1/k) = k^2$ para todos los enteros $k$ tales que $1 \le |k| \le n$. Encuentra todos los demás números reales $x$ para los cuales $p(1/x) = x^2$.`),
  putnam('PUTNAM-2023-A3', 2023, 'A', 3, 'Menor cero de un par de funciones acopladas', 'Análisis', String.raw`Determina el número real positivo más pequeño tal que existen funciones diferenciables $f: \mathbb{R} \to \mathbb{R}$ y $g: \mathbb{R} \to \mathbb{R}$ que satisfacen (a) $f(0) > 0$, (b) $g(0) = 0$, (c) $|f'(x)| \le |g(x)|$ para todo $x$, (d) $|g'(x)| \le |f(x)|$ para todo $x$, y (e) $f(r) = 0$.`),
  putnam('PUTNAM-2023-A4', 2023, 'A', 4, 'Aproximación de vectores con combinaciones enteras de un icosaedro', 'Álgebra Lineal', String.raw`Sean $v_1, \dots, v_{12}$ vectores unitarios en $\mathbb{R}^3$ desde el origen hasta los vértices de un icosaedro regular. Muestra que para cada vector $v \in \mathbb{R}^3$ y cada $\epsilon > 0$, existen enteros $a_1, \dots, a_{12}$ tales que $||a_1 v_1 + \dots + a_{12} v_{12} - v|| < \epsilon$.`),
  putnam('PUTNAM-2023-A5', 2023, 'A', 5, 'Suma con signos alternantes en base 3', 'Teoría de Números', String.raw`Para un entero no negativo $k$, sea $f(k)$ el número de unos en la representación en base 3 de $k$. Encuentra todos los números complejos $z$ tales que $\sum_{k=0}^{3^{1010}-1} (-2)^{f(k)}(z+k)^{2023} = 0$.`),
  putnam('PUTNAM-2023-A6', 2023, 'A', 6, 'Juego de paridad eligiendo enteros', 'Combinatoria', String.raw`Alice y Bob juegan un juego en el que se turnan eligiendo enteros del 1 al $N$. Antes de que se elija cualquier entero, Bob selecciona una meta de "par" o "impar". En el primer turno, Alice elige uno de los $N$ enteros. En el segundo turno, Bob elige uno de los enteros restantes. Continúan eligiendo alternadamente uno de los enteros que aún no ha sido elegido, hasta el turno 12, que es forzado y termina el juego. Bob gana si la paridad de $\{k \mid \text{el número } k \text{ fue elegido en el turno } k\}$ coincide con su meta. ¿Para qué valores de $N$ tiene Bob una estrategia ganadora?`),
  putnam('PUTNAM-2023-B1', 2023, 'B', 1, 'Configuraciones alcanzables deslizando monedas', 'Combinatoria', String.raw`Considera una cuadrícula de $m \times n$ de cuadrados unitarios, indexados por $(i,j)$ con $1 \le i \le m$ y $1 \le j \le n$. Hay $(m-1)(n-1)$ monedas, que se colocan inicialmente en los cuadrados $(i,j)$ con $1 \le i \le m-1$ y $1 \le j \le n-1$. Si una moneda ocupa el cuadrado $(i,j)$ con $1 \le i \le m-1$ y $1 \le j \le n-1$ y los cuadrados $(i+1,j), (i,j+1), (i+1,j+1)$ están desocupados, un movimiento legal es deslizar la moneda de $(i,j)$ a $(i+1,j+1)$. ¿Cuántas configuraciones distintas de monedas se pueden alcanzar comenzando desde la configuración inicial mediante una secuencia (posiblemente vacía) de movimientos legales?`),
  putnam('PUTNAM-2023-B2', 2023, 'B', 2, 'Mínimo de unos en la representación binaria de 2023n', 'Teoría de Números', String.raw`Para cada entero positivo $n$, sea $k(n)$ el número de unos en la representación binaria de $2023 \cdot n$. ¿Cuál es el valor mínimo de $k(n)$?`),
  putnam('PUTNAM-2023-B3', 2023, 'B', 3, 'Longitud esperada de una subsucesión zigzag', 'Probabilidad', String.raw`Una sucesión $y_1, y_2, \dots, y_k$ de números reales se llama en zigzag si $k=1$, o si $y_2-y_1, y_3-y_2, \dots, y_k-y_{k-1}$ son distintos de cero y alternan en signo. Sean $X_1, X_2, \dots, X_n$ elegidos independientemente de la distribución uniforme en $[0,1]$. Sea $a(X_1, X_2, \dots, X_n)$ el valor más grande de $k$ para el cual existe una sucesión creciente de enteros $i_1, i_2, \dots, i_k$ tal que $X_{i_1}, X_{i_2}, \dots, X_{i_k}$ es en zigzag. Encuentra el valor esperado de $a(X_1, X_2, \dots, X_n)$ para $n \ge 2$.`),
  putnam('PUTNAM-2023-B4', 2023, 'B', 4, 'Menor T para alcanzar el valor 2023', 'Análisis', String.raw`Para un entero no negativo $n$ y una sucesión estrictamente creciente de números reales $t_0, t_1, \dots, t_n$, sea $f(t)$ la función de valor real correspondiente definida para $t \ge t_0$ por las siguientes propiedades: (a) $f(t)$ es continua para $t \ge t_0$ y es dos veces diferenciable para todo $t > t_0$ distinto de $t_1, \dots, t_n$; (b) $f(t_0) = 1/2$; (c) $\lim_{t \to t_k^+} f'(t) = 0$ para $0 \le k \le n$; (d) Para $0 \le k \le n-1$, tenemos $f''(t) = k+1$ cuando $t_k < t < t_{k+1}$, y $f''(t) = n+1$ cuando $t > t_n$. Considerando todas las elecciones de $n$ y $t_0, t_1, \dots, t_n$ tales que $t_k \ge t_{k-1} + 1$ para $1 \le k \le n$, ¿cuál es el valor más pequeño posible de $T$ para el cual $f(t_0 + T) = 2023$?`),
  putnam('PUTNAM-2023-B5', 2023, 'B', 5, 'Permutaciones que satisfacen π(π(k)) ≡ mk', 'Teoría de Números', String.raw`Determina qué enteros positivos $n$ tienen la siguiente propiedad: Para todos los enteros $M$ que son relativamente primos con $N$, existe una permutación $\pi: \{1, 2, \dots, n\} \to \{1, 2, \dots, n\}$ tal que $\pi(\pi(k)) \equiv mk \pmod{n}$ para todo $k \in \{1, 2, \dots, n\}$.`),
  putnam('PUTNAM-2023-B6', 2023, 'B', 6, 'Determinante de una matriz de conteo de soluciones', 'Álgebra Lineal', String.raw`Sea $n$ un entero positivo. Para $i$ y $j$ en $\{1, 2, \dots, n\}$, sea $s(i,j)$ el número de pares $(a,b)$ de enteros no negativos que satisfacen $ai + bj = n$. Sea $S$ la matriz de $n \times n$ cuya entrada $(i,j)$ es $s(i,j)$. Calcula el determinante de $S$.`),
]

const putnam2024 = [
  putnam('PUTNAM-2024-A1', 2024, 'A', 1, 'Enteros n con solución de 2aⁿ + 3bⁿ = 4cⁿ', 'Teoría de Números', String.raw`Determina todos los enteros positivos $n$ para los cuales existen enteros positivos $a, b$ y $c$ que satisfacen $2a^n + 3b^n = 4c^n$.`),
  putnam('PUTNAM-2024-A2', 2024, 'A', 2, 'Polinomios p con esta factorización de p(p(x)) − x', 'Álgebra', String.raw`¿Para qué polinomios reales $p$ existe un polinomio real $q$ tal que $p(p(x)) - x = (p(x) - x)^2 q(x)$ para todo $x$ real?`),
  putnam('PUTNAM-2024-A3', 2024, 'A', 3, 'Fracción de comparaciones en biyecciones ordenadas', 'Combinatoria', String.raw`Sea $S$ el conjunto de biyecciones $T: \{1, 2, 3\} \times \{1, 2, \dots, 2024\} \to \{1, 2, \dots, 6072\}$ tales que $T(1,j) < T(2,j) < T(3,j)$ para todo $j \in \{1, 2, \dots, 2024\}$ y $T(i,j) < T(i, j+1)$ para todo $i \in \{1, 2, 3\}$ y $j \in \{1, 2, \dots, 2023\}$. ¿Existen $a$ y $c$ en $\{1, 2, 3\}$ y $b$ y $d$ en $\{1, 2, \dots, 2024\}$ tales que la fracción de elementos $T$ en $S$ para los cuales $T(a,b) < T(c,d)$ es al menos $1/3$ y a lo más $2/3$?`),
  putnam('PUTNAM-2024-A4', 2024, 'A', 4, 'Reordenamiento de potencias con diferencia constante mod p', 'Teoría de Números', String.raw`Encuentra todos los primos $p > 5$ para los cuales existe un entero $a$ y un entero $r$ que satisfacen $1 \le r \le p-1$ con la siguiente propiedad: la sucesión $1, a, a^2, \dots, a^{p-5}$ se puede reordenar para formar una sucesión $b_0, b_1, b_2, \dots, b_{p-5}$ tal que $b_n - b_{n-1} - r$ es divisible por $p$ para $1 \le n \le p-5$.`),
  putnam('PUTNAM-2024-A5', 2024, 'A', 5, 'Radio que minimiza la intersección de una cuerda con un disco', 'Probabilidad', String.raw`Considera el círculo de radio 9 y centro en el origen $(0,0)$, y un disco de radio 1 y centro en $(r,0)$, donde $0 \le r \le 8$. Se eligen dos puntos $P$ y $Q$ independiente y uniformemente al azar en el círculo. ¿Qué valor(es) de $r$ minimizan la probabilidad de que la cuerda $\overline{PQ}$ interseque al disco?`),
  putnam('PUTNAM-2024-A6', 2024, 'A', 6, 'Determinante de una matriz de Hankel generada por una raíz cuadrada', 'Álgebra Lineal', String.raw`Sea $c_0, c_1, c_2, \dots$ una sucesión definida de modo que $\frac{1 - 3x - \sqrt{1 - 14x + 9x^2}}{4} = \sum_{k=0}^{\infty} c_k x^k$ para $x$ suficientemente pequeño. Para un entero positivo $n$, sea $A$ la matriz de $n \times n$ con entrada $(i,j)$ igual a $c_{i+j-1}$ para $i$ y $j$ en $\{1, \dots, n\}$. Encuentra el determinante de $A$.`),
  putnam('PUTNAM-2024-B1', 2024, 'B', 1, 'Selección de casillas con valores 1 a n', 'Combinatoria', String.raw`Sean $n$ y $k$ enteros positivos. El cuadrado en la $i$-ésima fila y $j$-ésima columna de una cuadrícula de $n \times n$ contiene el número $i+j-k$. ¿Para qué $n$ y $k$ es posible seleccionar $n$ cuadrados de la cuadrícula, sin que dos estén en la misma fila o columna, tales que los números contenidos en los cuadrados seleccionados sean exactamente $1, 2, \dots, n$?`),
  putnam('PUTNAM-2024-B2', 2024, 'B', 2, 'Sucesión infinita de cuadriláteros "socios"', 'Geometría', String.raw`Dos cuadriláteros convexos se llaman socios si tienen tres vértices en común y se pueden etiquetar como $ABCD$ y $ABCE$ de modo que $E$ sea la reflexión de $D$ a través de la mediatriz de la diagonal $\overline{AC}$. ¿Existe una sucesión infinita de cuadriláteros convexos tal que cada cuadrilátero sea socio de su sucesor y no haya dos elementos de la sucesión que sean congruentes?`),
  putnam('PUTNAM-2024-B3', 2024, 'B', 3, 'Cota en la diferencia entre raíces consecutivas de tan x = x', 'Análisis', String.raw`Sea $r_n$ la $n$-ésima solución positiva más pequeña de $\tan x = x$ donde el argumento de la tangente está en radianes. Demuestra que $0 < r_{n+1} - r_n - \pi < \frac{1}{(n^2+n)\pi}$ para $n \ge 1$.`),
  putnam('PUTNAM-2024-B4', 2024, 'B', 4, 'Límite del valor esperado de un paseo aleatorio acotado', 'Probabilidad', String.raw`Sea $n$ un entero positivo. Establece $a_{n,0} = 1$. Para $k \ge 0$, elige un entero $m_{n,k}$ uniformemente al azar del conjunto $\{1, \dots, n\}$, y sea $a_{n,k+1} = a_{n,k}+1$ si $m_{n,k} > a_{n,k}$; $a_{n,k}$ si $m_{n,k} = a_{n,k}$; y $a_{n,k}-1$ si $m_{n,k} < a_{n,k}$. Sea $E(n)$ el valor esperado de $a_{n,n}$. Determina $\lim_{n\to\infty} E(n)/n$.`),
  putnam('PUTNAM-2024-B5', 2024, 'B', 5, 'Polinomio de conteo con coeficientes no negativos', 'Combinatoria', String.raw`Sean $k$ y $m$ enteros positivos. Para un entero positivo $n$, sea $f(n)$ el número de sucesiones de enteros $x_1, \dots, x_k, y_1, \dots, y_m$ que satisfacen $1 \le x_1 \le \dots \le x_k \le z \le n$ y $1 \le y_1 \le \dots \le y_m \le z \le n$. Muestra que $f(n)$ se puede expresar como un polinomio en $n$ con coeficientes no negativos.`),
  putnam('PUTNAM-2024-B6', 2024, 'B', 6, 'Constante crítica para el crecimiento de F_a(x)', 'Análisis', String.raw`Para un número real $a$, sea $F_a(x) = \sum_{n \ge 1} n^a e^{2n} x^{n^2}$ para $0 \le x < 1$. Encuentra un número real $C$ tal que $\lim_{x \to 1^-} F_a(x) e^{-1/(1-x)} = 0$ para todo $a < C$ y $\lim_{x \to 1^-} F_a(x) e^{-1/(1-x)} = \infty$ para todo $a > C$.`),
]

const putnam2025 = [
  putnam('PUTNAM-2025-A1', 2025, 'A', 1, 'Coprimalidad eventual de una recursión de fracciones', 'Teoría de Números', String.raw`Sean $m_0$ y $n_0$ enteros positivos distintos. Para cada entero positivo $k$, define $m_k$ y $n_k$ como los enteros positivos relativamente primos tales que $\frac{m_k}{n_k} = \frac{2m_{k-1}+1}{2n_{k-1}+1}$. Demuestra que $2m_k+1$ y $2n_k+1$ son relativamente primos para todos los enteros positivos $k$ excepto un número finito de ellos.`),
  putnam('PUTNAM-2025-A2', 2025, 'A', 2, 'Cotas óptimas cuadráticas para sin x', 'Análisis', String.raw`Encuentra el número real más grande $a$ y el número real más pequeño $b$ tales que $ax(\pi-x) \le \sin x \le bx(\pi-x)$ para todo $x$ en el intervalo $[0, \pi]$.`),
  putnam('PUTNAM-2025-A3', 2025, 'A', 3, 'Juego de cadenas ternarias sin repetición', 'Combinatoria', String.raw`Alice y Bob juegan un juego con una cadena de $n$ dígitos, cada uno de los cuales está restringido a ser 0, 1 o 2. Inicialmente todos los dígitos son 0. Un movimiento legal es sumar o restar 1 de un dígito para crear una nueva cadena que no haya aparecido antes. Un jugador sin movimientos legales pierde, y el otro jugador gana. Alice juega primero, y los jugadores alternan turnos. Para cada $n \ge 1$, determina qué jugador tiene una estrategia que garantiza ganar.`),
  putnam('PUTNAM-2025-A4', 2025, 'A', 4, 'Tamaño mínimo de matrices con un patrón de conmutación cíclico', 'Álgebra Lineal', String.raw`Encuentra el valor mínimo de $k$ tal que existen matrices reales $A_1, \dots, A_{2025}$ de tamaño $k \times k$ con la propiedad de que $A_i A_j = A_j A_i$ si y solo si $|i-j| \in \{0, 1, 2024\}$.`),
  putnam('PUTNAM-2025-A5', 2025, 'A', 5, 'Signos que maximizan permutaciones ordenadas', 'Combinatoria', String.raw`Sea $n$ un entero con $n \ge 2$. Para una sucesión $s = (s_1, \dots, s_{n-1})$ donde cada $s_i = \pm 1$, sea $f(s)$ el número de permutaciones $(a_1, \dots, a_n)$ de $\{1, 2, \dots, n\}$ tales que $s_i(a_{i+1} - a_i) > 0$ para todo $i$. Para cada $n$, determina las sucesiones $s$ para las cuales $f(s)$ es máximo.`),
  putnam('PUTNAM-2025-A6', 2025, 'A', 6, 'Divisibilidad en una sucesión binaria recursiva', 'Teoría de Números', String.raw`Sea $b_0 = 0$ y, para $n \ge 0$, define $b_{n+1} = 2b_n + b_n + 1$. Para cada $k \ge 1$, muestra que $b_{2^{k+1}} - 2b_{2^k}$ es divisible por $2^{2k+2}$ pero no por $2^{2k+3}$.`),
  putnam('PUTNAM-2025-B1', 2025, 'B', 1, 'Coloración del plano cerrada bajo circuncentros', 'Geometría', String.raw`Supón que cada punto del plano está coloreado de rojo o verde, sujeto a la siguiente condición: Para cada tres puntos no colineales $A, B, C$ del mismo color, el centro del círculo que pasa por $A, B$ y $C$ también es de este color. Demuestra que todos los puntos del plano son del mismo color.`),
  putnam('PUTNAM-2025-B2', 2025, 'B', 2, 'Comparación de centroides de una región y su sólido de revolución', 'Análisis', String.raw`Sea $f: [0,1] \to [0, \infty)$ estrictamente creciente y continua. Sea $R$ la región acotada por $x=0$, $x=1$, $y=0$ e $y=f(x)$. Sea $x_1$ la coordenada $x$ del centroide de $R$. Sea $x_2$ la coordenada $x$ del centroide del sólido generado al rotar $R$ alrededor del eje $x$. Demuestra que $x_1 < x_2$.`),
  putnam('PUTNAM-2025-B3', 2025, 'B', 3, 'Conjunto cerrado bajo divisores de 2025ⁿ − 15ⁿ', 'Teoría de Números', String.raw`Supón que $S$ es un conjunto no vacío de enteros positivos con la propiedad de que si $n$ está en $S$, entonces todo divisor positivo de $2025^n - 15^n$ está en $S$. ¿Debe $S$ contener todos los enteros positivos?`),
  putnam('PUTNAM-2025-B4', 2025, 'B', 4, 'Cota de suma entre entradas no nulas en una matriz escalera', 'Combinatoria', String.raw`Para $n \ge 2$, sea $A = [a_{i,j}]_{i,j=1}^n$ una matriz de $n \times n$ de enteros no negativos tal que (a) $a_{i,j} = 0$ cuando $i+j \le n$, (b) $a_{i+1,j} \in \{a_{i,j}, a_{i,j}+1\}$ cuando $1 \le i \le n-1$ y $1 \le j \le n$, y (c) $a_{i,j+1} \in \{a_{i,j}, a_{i,j}+1\}$ cuando $1 \le i \le n$ y $1 \le j \le n-1$. Sea $S$ la suma de las entradas de $A$, y sea $N$ el número de entradas no nulas de $A$. Demuestra que $S \le \frac{(n+2)N}{3}$.`),
  putnam('PUTNAM-2025-B5', 2025, 'B', 5, 'Descensos del inverso modular', 'Teoría de Números', String.raw`Sea $p$ un número primo mayor que 3. Para cada $k \in \{1, \dots, p-1\}$, sea $I(k) \in \{1, 2, \dots, p-1\}$ tal que $k \cdot I(k) \equiv 1 \pmod{p}$. Demuestra que el número de enteros $k \in \{1, \dots, p-2\}$ tales que $I(k+1) < I(k)$ es mayor que $p/4 - 1$.`),
  putnam('PUTNAM-2025-B6', 2025, 'B', 6, 'Máxima constante r para un crecimiento tipo g(g(n))^r', 'Análisis', String.raw`Sea $\mathbb{N} = \{1, 2, 3, \dots\}$. Encuentra la constante real más grande tal que existe una función $g: \mathbb{N} \to \mathbb{N}$ tal que $g(n+1) - g(n) \ge (g(g(n)))^r$ para todo $n \in \mathbb{N}$.`),
]

export const problemas = [
  ...ommuPrimeraRonda,
  ...ommuNacional,
  ...putnam1985,
  ...putnam1986,
  ...putnam1987,
  ...putnam1988,
  ...putnam1989,
  ...putnam1990,
  ...putnam1991,
  ...putnam1992,
  ...putnam1993,
  ...putnam1994,
  ...putnam2021,
  ...putnam2022,
  ...putnam2023,
  ...putnam2024,
  ...putnam2025,
]
