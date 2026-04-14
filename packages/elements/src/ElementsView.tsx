import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { KnowletContext, getThemeColors, getAbstractColors } from '@iching-kt/core';
import { WuXingId, WU_XING_ORDER, getTranslation } from './data';

// Pentagram node positions (percent of 300x300 canvas, centered at 150,150, r=110)
// Top=fire, then clockwise: earth, metal, wood, water
const PENTAGRAM_POSITIONS: Record<WuXingId, { x: number; y: number }> = {
  fire:  { x: 150, y: 18  },
  earth: { x: 256, y: 90  },
  metal: { x: 218, y: 230 },
  wood:  { x: 82,  y: 230 },
  water: { x: 44,  y: 90  },
};

// Generating cycle (生): wood→fire→earth→metal→water→wood
const GENERATING_CYCLE: WuXingId[] = ['wood', 'fire', 'earth', 'metal', 'water'];

// Overcoming cycle (克): wood→earth, earth→water, water→fire, fire→metal, metal→wood
const OVERCOMING_PAIRS: [WuXingId, WuXingId][] = [
  ['wood',  'earth'],
  ['earth', 'water'],
  ['water', 'fire' ],
  ['fire',  'metal'],
  ['metal', 'wood' ],
];

interface Props {
  context: KnowletContext;
}

export function ElementsView({ context }: Props) {
  const inputElement = context.inputData?.value as WuXingId | undefined;
  const [selected, setSelected] = useState<WuXingId>(inputElement ?? 'wood');

  const t = getTranslation(context.language);
  const colors = getThemeColors(context.colorScheme);
  const abstractColors = getAbstractColors(context.colorScheme);

  const elementData = t.elements[selected];
  const elementColor = abstractColors.elements[selected].activeColor;
  const elementDefaultColor = abstractColors.elements[selected].defaultColor;

  const handleNodePress = (id: WuXingId) => {
    setSelected(id);
    context.emitOutput('element', id);
  };

  const handleTrigramPress = () => {
    context.emitOutput('trigram', elementData.primaryTrigram);
  };

  const handleYinYangPress = () => {
    const yinyang: 'yin' | 'yang' =
      selected === 'metal' || selected === 'water' ? 'yin' : 'yang';
    context.emitOutput('yinyang', yinyang);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: elementColor }]}>
        <Text style={styles.headerChinese}>{elementData.chinese}</Text>
        <Text style={styles.headerPinyin}>{elementData.pinyin}</Text>
        <Text style={styles.headerName}>
          {selected.charAt(0).toUpperCase() + selected.slice(1)}
        </Text>
      </View>

      {/* Description */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.description, { color: colors.text }]}>
          {elementData.description}
        </Text>
      </View>

      {/* Correspondences table */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        {(
          [
            ['direction', elementData.direction],
            ['season',    elementData.season],
            ['organ',     elementData.organ],
            ['emotion',   elementData.emotion],
            ['taste',     elementData.taste],
          ] as [keyof typeof t.labels, string][]
        ).map(([key, value]) => (
          <View key={key} style={[styles.row, { borderBottomColor: colors.border }]}>
            <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>
              {t.labels[key]}
            </Text>
            <Text style={[styles.rowValue, { color: colors.text }]}>{value}</Text>
          </View>
        ))}
      </View>

      {/* Cycles */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          {t.labels.generatingCycle}
        </Text>
        <View style={[styles.row, { borderBottomColor: colors.border }]}>
          <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>
            {t.labels.generates}
          </Text>
          <Text
            style={[
              styles.rowValue,
              { color: abstractColors.elements[elementData.generates].activeColor },
            ]}
          >
            {t.elements[elementData.generates].chinese} {elementData.generates}
          </Text>
        </View>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 8 }]}>
          {t.labels.overcomingCycle}
        </Text>
        <View style={[styles.row, { borderBottomColor: colors.border }]}>
          <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>
            {t.labels.overcomes}
          </Text>
          <Text
            style={[
              styles.rowValue,
              { color: abstractColors.elements[elementData.overcomes].activeColor },
            ]}
          >
            {t.elements[elementData.overcomes].chinese} {elementData.overcomes}
          </Text>
        </View>
        <View style={[styles.row, { borderBottomColor: colors.border }]}>
          <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>
            {t.labels.overcomeBy}
          </Text>
          <Text
            style={[
              styles.rowValue,
              { color: abstractColors.elements[elementData.overcomeBy].activeColor },
            ]}
          >
            {t.elements[elementData.overcomeBy].chinese} {elementData.overcomeBy}
          </Text>
        </View>
      </View>

      {/* Pentagram diagram */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <PentagramDiagram
          selected={selected}
          abstractColors={abstractColors}
          onNodePress={handleNodePress}
        />
      </View>

      {/* Emit buttons */}
      <View style={[styles.section, styles.emitRow, { backgroundColor: colors.surface }]}>
        <Pressable
          style={[
            styles.emitButton,
            { backgroundColor: elementDefaultColor, borderColor: elementColor },
          ]}
          onPress={handleTrigramPress}
          onLongPress={() =>
            context.showKnowletSelector('trigram', elementData.primaryTrigram)
          }
        >
          <Text style={[styles.emitButtonText, { color: elementColor }]}>
            {t.labels.trigram}: {elementData.primaryTrigram}
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.emitButton,
            { backgroundColor: elementDefaultColor, borderColor: elementColor },
          ]}
          onPress={handleYinYangPress}
          onLongPress={() => {
            const yy: 'yin' | 'yang' =
              selected === 'metal' || selected === 'water' ? 'yin' : 'yang';
            context.showKnowletSelector('yinyang', yy);
          }}
        >
          <Text style={[styles.emitButtonText, { color: elementColor }]}>
            {selected === 'metal' || selected === 'water' ? '陰 Yin' : '陽 Yang'}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const NODE_R = 28;
const CANVAS = 300;

interface PentagramProps {
  selected: WuXingId;
  abstractColors: ReturnType<typeof getAbstractColors>;
  onNodePress: (id: WuXingId) => void;
}

/** Pure React Native pentagram — uses absolute-positioned Views, no SVG dep required */
function PentagramDiagram({ selected, abstractColors, onNodePress }: PentagramProps) {
  return (
    <View style={[styles.pentagram, { width: CANVAS, height: CANVAS }]}>
      {/* We render nodes as colored circles; lines are omitted (no SVG) */}
      {/* Generate cycle: faint connecting dots rendered as thin bridges */}
      {WU_XING_ORDER.map((id) => {
        const pos = PENTAGRAM_POSITIONS[id];
        const isSelected = id === selected;
        const aColor = abstractColors.elements[id].activeColor;
        const dColor = abstractColors.elements[id].defaultColor;
        const chinese =
          id === 'wood' ? '木' :
          id === 'fire' ? '火' :
          id === 'earth' ? '土' :
          id === 'metal' ? '金' : '水';

        return (
          <Pressable
            key={id}
            onPress={() => onNodePress(id)}
            style={[
              styles.node,
              {
                left: pos.x - NODE_R,
                top: pos.y - NODE_R,
                width: NODE_R * 2,
                height: NODE_R * 2,
                borderRadius: NODE_R,
                backgroundColor: isSelected ? aColor : dColor,
                borderColor: aColor,
                borderWidth: isSelected ? 3 : 1.5,
              },
            ]}
          >
            <Text style={[styles.nodeChar, { color: isSelected ? '#fff' : aColor }]}>
              {chinese}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  headerChinese: { fontSize: 56, color: '#fff', fontWeight: 'bold' },
  headerPinyin: { fontSize: 18, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  headerName: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  section: {
    marginTop: 12,
    marginHorizontal: 12,
    borderRadius: 10,
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 4,
    marginBottom: 4,
  },
  description: { fontSize: 15, lineHeight: 22, paddingVertical: 8 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLabel: { fontSize: 14 },
  rowValue: { fontSize: 14, fontWeight: '500' },
  emitRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  emitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  emitButtonText: { fontSize: 14, fontWeight: '600' },
  pentagram: { position: 'relative', alignSelf: 'center' },
  node: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nodeChar: { fontSize: 18, fontWeight: 'bold' },
});
