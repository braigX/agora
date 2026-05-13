# TPs Scala

## TP 1

### Complex.scala

```scala
package tp01.complex

import scala.math.{sqrt, acos, cos, sin}

class Complex(val real: Double, val imag: Double) extends Ordered[Complex]:

  override def toString =
    if real == 0 && imag == 0 then "0"
    else if real == 0 then
      if imag == 1 then "i"
      else if imag == -1 then "-i"
      else imag.toString + "i"
    else if imag == 0 then real.toString
    else if imag == 1 then real.toString + " + i"
    else if imag == -1 then real.toString + " - i"
    else if imag > 0 then real.toString + " + " + imag.toString + "i"
    else real.toString + " - " + (-imag).toString + "i"

  def mod = sqrt(real * real + imag * imag)

  def arg = if imag >= 0 then acos(real / mod) else -acos(real / mod)

  def +(that: Complex) = Complex(real + that.real, imag + that.imag)
  def +(that: Double)  = Complex(real + that, imag)
  def -(that: Complex) = Complex(real - that.real, imag - that.imag)
  def -(that: Double)  = Complex(real - that, imag)

  def *(that: Complex) = Complex(
    real * that.real - imag * that.imag,
    real * that.imag + imag * that.real
  )
  def *(that: Double) = Complex(real * that, imag * that)

  def /(that: Complex) =
    val d = that.real * that.real + that.imag * that.imag
    Complex(
      (real * that.real + imag * that.imag) / d,
      (imag * that.real - real * that.imag) / d
    )
  def /(that: Double) = Complex(real / that, imag / that)

  def conj = Complex(real, -imag)

  def compare(that: Complex): Int =
    val cmp = real.compareTo(that.real)
    if cmp != 0 then cmp else imag.compareTo(that.imag)

  override def equals(that: Any) = that match
    case c: Complex => c.real == real && c.imag == imag
    case _ => false

  override def hashCode() = (real, imag).##

end Complex

object Complex:
  def apply(real: Double, imag: Double) = new Complex(real, imag)

object PolarComplex:
  def apply(mod: Double, arg: Double) =
    new Complex(mod * cos(arg), mod * sin(arg))

extension (x: Int)
  def +(that: Complex): Complex = Complex(x + that.real, that.imag)
```

### Pascal.scala

```scala
package tp01.pascal

object Pascal:
  def main(args: Array[String]): Unit =
    println("Le triangle de Pascal valeur par valeur :")
    printTriangle1(args(0).toInt)
    println("Le triangle de Pascal en un seul coup :")
    printTriangle2(args(0).toInt)

  def value(c: Int, r: Int): Int =
    if c == 0 || c == r then 1
    else value(c - 1, r - 1) + value(c, r - 1)

  def printTriangle1(n: Int) =
    for r <- 0 until n do
      for c <- 0 to r do
        print(value(c, r) + " ")
      println()

  type Line = List[Int]

  private def nextLine(line: Line): Line =
    1 :: (line zip line.tail).map { case (a, b) => a + b } :+ 1

  def triangle(n: Int): List[Line] =
    if n == 0 then List(List(1))
    else
      val tr = triangle(n - 1)
      tr :+ nextLine(tr.last)

  def printTriangle2(n: Int) =
    for line <- triangle(n) do
      println(line.mkString(" "))
end Pascal
```

### MultiSet.scala

```scala
package tp01.multiSet

class MultiSet[E](val elems: Map[E, Int]):

  def size = elems.size

  def card: Int = elems.values.sum

  def mem(e: E) = elems.contains(e)

  def count(e: E) = elems.getOrElse(e, 0)

  def subsetOf(that: MultiSet[E]) =
    elems.forall { case (e, n) => that.count(e) >= n }

  def add(e: E, n: Int) =
    MultiSet(elems + (e -> (count(e) + n)))

  def remove(e: E, n: Int) =
    val newCount = count(e) - n
    if newCount <= 0 then MultiSet(elems - e)
    else MultiSet(elems + (e -> newCount))

  def union(that: MultiSet[E]) =
    val allKeys = elems.keySet ++ that.elems.keySet
    MultiSet(allKeys.map(k => k -> (this.count(k) + that.count(k))).toMap)

  def diff(that: MultiSet[E]) =
    val newElems = elems.flatMap { case (e, n) =>
      val rest = n - that.count(e)
      if rest > 0 then Some(e -> rest) else None
    }
    MultiSet(newElems)

  def maximum(that: MultiSet[E]) =
    val allKeys = elems.keySet ++ that.elems.keySet
    MultiSet(allKeys.map(k => k -> math.max(this.count(k), that.count(k))).toMap)

  def inter(that: MultiSet[E]) =
    val commonKeys = elems.keySet intersect that.elems.keySet
    MultiSet(commonKeys.map(k => k -> math.min(this.count(k), that.count(k))).toMap)

  override def equals(that: Any) = that match
    case ms: MultiSet[_] => ms.elems == elems
    case _ => false

  override def hashCode() = elems.hashCode()

  override def toString =
    "MultiSet(" + elems.map { case (e, n) => s"$e -> $n" }.mkString(", ") + ")"

end MultiSet

object MultiSet:
  def apply[E](elems: Map[E, Int]) = new MultiSet(elems)
```

## TP 2

### Anagrams.scala

```scala
package tp02.anagrams

object Anagrams {
  type Word = String
  type Sentence = List[Word]
  type Occurrences = List[(Char, Int)]

  private val dictionary: List[Word] = {
    val resourceFile = new java.io.File("src/main/scala/tp02/resources/dico.txt")
    val source = io.Source.fromFile(resourceFile)
    source.getLines.toList
  }

  def wordOccurrences(w: Word): Occurrences =
    w.toLowerCase.toList
     .groupBy(identity)
     .map { case (c, occs) => (c, occs.length) }
     .toList
     .sortBy(_._1)

  def sentenceOccurrences(s: Sentence): Occurrences =
    wordOccurrences(s.mkString(""))

  lazy val dictionaryByOccurrences: Map[Occurrences, List[Word]] =
    dictionary.groupBy(wordOccurrences)

  def wordAnagrams(word: Word): List[Word] =
    dictionaryByOccurrences.getOrElse(wordOccurrences(word), Nil)

  def combinations(occurrences: Occurrences): List[Occurrences] = occurrences match
    case Nil => List(Nil)
    case (c, n) :: tail =>
      val tailCombos = combinations(tail)
      tailCombos ++ (for {
        i <- (1 to n).toList
        combo <- tailCombos
      } yield (c, i) :: combo)

  def subtract(x: Occurrences, y: Occurrences): Occurrences =
    val yMap = y.toMap
    x.flatMap { case (c, n) =>
      val rest = n - yMap.getOrElse(c, 0)
      if rest > 0 then Some((c, rest)) else None
    }

  def sentenceAnagrams(sentence: Sentence): List[Sentence] = {
    def helper(occurrences: Occurrences): List[Sentence] =
      if occurrences.isEmpty then List(Nil)
      else
        for {
          combo <- combinations(occurrences)
          word  <- dictionaryByOccurrences.getOrElse(combo, Nil)
          rest  <- helper(subtract(occurrences, combo))
        } yield word :: rest

    helper(sentenceOccurrences(sentence))
  }
}
```

## TP 3

### Huffman.scala

```scala
package tp03

object Huffman {
  type Bit = Int

  abstract class HuffmanTree
  case class Leaf(char: Char, weight: Int) extends HuffmanTree
  case class Node(left: HuffmanTree, right: HuffmanTree,
      chars: List[Char], weight: Int) extends HuffmanTree

  def weight(tree: HuffmanTree): Int = tree match
    case Leaf(_, w)       => w
    case Node(_, _, _, w) => w

  def chars(tree: HuffmanTree): List[Char] = tree match
    case Leaf(c, _)        => List(c)
    case Node(_, _, cs, _) => cs

  def buildTree(left: HuffmanTree, right: HuffmanTree): HuffmanTree =
    Node(left, right,
         chars(left) ++ chars(right),
         weight(left) + weight(right))

  def buildLeaves(chars: List[Char]): List[Leaf] =
    chars.groupBy(identity)
         .map { case (c, occs) => Leaf(c, occs.length) }
         .toList

  def insert[T <: HuffmanTree](t: T, trees: List[T]): List[T] = trees match
    case Nil => List(t)
    case head :: tail =>
      if weight(t) <= weight(head) then t :: trees
      else head :: insert(t, tail)

  def buildHuffmanTree(leaves: List[Leaf]): HuffmanTree =
    def loop(trees: List[HuffmanTree]): HuffmanTree = trees match
      case t :: Nil               => t
      case t1 :: t2 :: rest       => loop(insert(buildTree(t1, t2), rest))
      case Nil                    => throw new Exception("Liste vide")

    val sortedLeaves = leaves.sortBy(_.weight)
    loop(sortedLeaves)

  def decode(tree: HuffmanTree, bits: List[Bit]): List[Char] =
    def decodeOne(current: HuffmanTree, remaining: List[Bit]): List[Char] =
      current match
        case Leaf(c, _) =>
          if remaining.isEmpty then List(c)
          else c :: decodeOne(tree, remaining)
        case Node(left, right, _, _) =>
          if remaining.head == 0 then decodeOne(left, remaining.tail)
          else decodeOne(right, remaining.tail)
    decodeOne(tree, bits)

  def encode(tree: HuffmanTree, text: List[Char]): List[Bit] =
    def encodeOne(c: Char, current: HuffmanTree): List[Bit] = current match
      case Leaf(_, _) => Nil
      case Node(left, right, _, _) =>
        if chars(left).contains(c) then 0 :: encodeOne(c, left)
        else 1 :: encodeOne(c, right)
    text.flatMap(c => encodeOne(c, tree))

  type CodeTable = Map[Char, List[Bit]]

  def convert(tree: HuffmanTree): CodeTable =
    def loop(t: HuffmanTree, prefix: List[Bit]): List[(Char, List[Bit])] =
      t match
        case Leaf(c, _) => List(c -> prefix)
        case Node(left, right, _, _) =>
          loop(left, prefix :+ 0) ++ loop(right, prefix :+ 1)
    loop(tree, Nil).toMap

  def fastEncode(tree: HuffmanTree, text: List[Char]): List[Bit] =
    val table = convert(tree)
    text.flatMap(c => table(c))
}
```
