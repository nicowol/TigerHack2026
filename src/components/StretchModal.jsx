import { useState } from 'react'
import '../pose-animations.css'

const POSES = {
  'wall-slide': {
    label: 'Wall-assisted shoulder slide', head: [110, 22], body: 'M110 43L110 80',
    arms: 'M110 51L95 36L95 12 M110 51L125 36L125 12',
    legs: 'M110 80L92 119 M110 80L128 119', support: 'M82 8V128',
  },
  'seated-reach': {
    label: 'Seated forward reach', head: [82, 47], headAngle: 23,
    body: 'M103 49Q91 64 82 79', arms: 'M98 57L121 70L147 76 M98 57L118 75L147 80',
    legs: 'M82 79L116 83L151 83 M82 79L63 87L63 117', support: 'M17 121H194',
  },
  'seated-side-reach': {
    label: 'Seated side reach', head: [99, 25], headAngle: -8,
    body: 'M110 45Q103 62 98 78', arms: 'M108 52L91 43L81 18 M108 52L127 63L144 74',
    legs: 'M98 78L136 82L147 117 M98 78L74 84L69 117', support: 'M61 84H153',
  },
  'seated-overhead': {
    label: 'Seated overhead arm stretch', head: [110, 22], body: 'M110 43L110 76',
    arms: 'M110 51L94 39L98 13 M110 51L127 59L142 69',
    legs: 'M110 76L142 81L151 117 M110 76L78 81L72 117', support: 'M62 82H157',
  },
  'kneeling-overhead': {
    label: 'Kneeling overhead reach', head: [110, 22], body: 'M110 43L110 76',
    arms: 'M110 51L94 38L98 12 M110 51L127 60L143 65',
    legs: 'M110 76L91 92L70 92 M110 76L130 92L151 92', support: 'M17 117H194',
  },
  'prayer-wrist': {
    label: 'Prayer wrist stretch', head: [110, 22], body: 'M110 43L110 80',
    arms: 'M110 51L97 62L110 77 M110 51L123 62L110 77',
    legs: 'M110 80L92 119 M110 80L128 119',
  },
  'seated-wrist': {
    label: 'Seated wrist and hand stretch', head: [110, 22], body: 'M110 43L110 76',
    arms: 'M110 51L131 54L155 54 M110 51L92 61L133 60',
    legs: 'M110 76L142 81L151 117 M110 76L78 81L72 117', support: 'M62 82H157',
  },
  'wall-wrist': {
    label: 'Wall-supported wrist stretch', head: [110, 22], body: 'M110 43L110 80',
    arms: 'M110 51L89 55L70 55 M110 51L129 59L148 64',
    legs: 'M110 80L92 119 M110 80L128 119', support: 'M65 19V127',
  },
  'standing-twist': {
    label: 'Standing trunk rotation', head: [110, 22], headAngle: -8,
    body: 'M110 43Q103 60 110 80', arms: 'M108 51L91 58L73 54 M108 51L126 59L145 54',
    legs: 'M110 80L92 119 M110 80L128 119',
  },
  'side-lying-open': {
    label: 'Side-lying chest opener', head: [47, 84], face: 'left',
    body: 'M63 85L140 85', arms: 'M91 85L111 70L135 57 M91 85L74 69L59 64',
    legs: 'M140 85L160 97L181 97 M140 85L160 108L181 108', support: 'M17 121H194',
  },
  'side-lying-quad': {
    label: 'Side-lying quadriceps stretch', head: [47, 84], face: 'left',
    body: 'M63 85L140 85', arms: 'M91 85L75 99L59 103 M111 84L133 72L153 72',
    legs: 'M140 85L164 95L185 95 M140 85L158 70L144 54L129 62',
    support: 'M17 121H194',
  },
  pigeon: {
    label: 'Supported pigeon hip stretch', head: [110, 22], body: 'M110 43L110 75',
    arms: 'M110 51L92 69L77 83 M110 51L128 69L143 83',
    legs: 'M110 75L92 87L69 87L51 105 M92 87L125 94L155 94',
    support: 'M17 117H194',
  },
  'ankle-glide': {
    label: 'Supported ankle mobility', head: [89, 22], body: 'M110 43L105 78',
    arms: 'M110 51L131 48L151 48 M110 51L131 57L151 57',
    legs: 'M105 78L82 85L71 118 M105 78L128 82L130 118',
    support: 'M156 10V128',
  },
  'pelvic-tilt': {
    label: 'Supine pelvic tilt', head: [37, 91], face: 'right',
    body: 'M54 92L130 92', arms: 'M82 92L73 106 M100 92L108 106',
    legs: 'M130 92L148 81L165 81L176 112 M130 92L150 84L167 86L181 113',
    support: 'M17 122H193',
  },
  'neck-seated-tilt': {
    label: 'Seated neck side tilt', head: [103, 22], headAngle: -22,
    body: 'M110 43L110 76', arms: 'M110 51L92 60L88 82 M110 51L128 60L131 82',
    legs: 'M110 76L142 82L151 117 M110 76L78 82L72 117', support: 'M62 82H157',
  },
  'seated-blade-reach': {
    label: 'Seated shoulder-blade reach', head: [110, 22], body: 'M110 43L110 76',
    arms: 'M110 51L132 51L154 51 M110 51L132 57L154 57',
    legs: 'M110 76L142 82L151 117 M110 76L78 82L72 117', support: 'M62 82H157',
  },
  'neck-seated-rotation': {
    label: 'Seated neck rotation', head: [110, 22], face: 'left',
    body: 'M110 43L110 76', arms: 'M110 51L92 60L88 82 M110 51L128 60L131 82',
    legs: 'M110 76L142 82L151 117 M110 76L78 82L72 117', support: 'M62 82H157',
  },
  'neck-seated-flexion': {
    label: 'Seated neck flexion', head: [108, 25], headAngle: 20,
    body: 'M110 43L110 76', arms: 'M110 51L96 63L105 73 M110 51L124 63L115 73',
    legs: 'M110 76L142 82L151 117 M110 76L78 82L72 117', support: 'M62 82H157',
  },
  'neck-seated-retraction': {
    label: 'Seated chin tuck', head: [103, 22], headAngle: -10, face: 'left',
    body: 'M110 43L110 76', arms: 'M110 51L92 60L88 82 M110 51L128 60L131 82',
    legs: 'M110 76L142 82L151 117 M110 76L78 82L72 117', support: 'M62 82H157',
  },
  'neck-wall-retraction': {
    label: 'Wall-supported chin glide', head: [103, 22], headAngle: -10, face: 'left',
    body: 'M110 43L110 80', arms: 'M110 51L92 63L87 83 M110 51L130 63L133 83',
    legs: 'M110 80L92 119 M110 80L128 119', support: 'M69 8V128',
  },
  'neck-neutral': {
    label: 'Relaxed neutral neck position', head: [110, 22], face: 'right',
    body: 'M110 43L110 76', arms: 'M110 51L92 60L88 82 M110 51L128 60L131 82',
    legs: 'M110 76L142 82L151 117 M110 76L78 82L72 117', support: 'M62 82H157',
  },
  'neck-diagonal': {
    label: 'Diagonal neck stretch', head: [102, 24], headAngle: 24, face: 'left',
    body: 'M110 43L110 76', arms: 'M110 51L92 60L88 82 M110 51L128 60L131 82',
    legs: 'M110 76L142 82L151 117 M110 76L78 82L72 117', support: 'M62 82H157',
  },
  'neck-glide': {
    label: 'Side-to-side neck glide', head: [99, 22], face: 'left',
    body: 'M110 43L110 76', arms: 'M110 51L92 60L88 82 M110 51L128 60L131 82',
    legs: 'M110 76L142 82L151 117 M110 76L78 82L72 117', support: 'M62 82H157',
  },
  'neck-retraction': {
    label: 'Chin tuck', head: [103, 24], headAngle: -10, face: 'left',
    body: 'M110 43L110 80', arms: 'M110 51L92 63L87 83 M110 51L130 63L133 83',
    legs: 'M110 80L92 119 M110 80L128 119',
  },
  'neck-anchor': {
    label: 'Shoulder-anchored neck stretch', head: [103, 22], headAngle: -22,
    body: 'M110 43L110 76', arms: 'M110 51L92 60L88 82 M110 51L128 60L131 82',
    legs: 'M110 76L142 82L151 117 M110 76L78 82L72 117', support: 'M62 82H157',
  },
  'neck-supine-nod': {
    label: 'Supported supine chin nod', head: [37, 91], headAngle: 25, face: 'right',
    body: 'M54 92L131 92', arms: 'M82 92L72 107 M100 92L110 107',
    legs: 'M131 92L158 92L178 101 M131 92L158 92L178 84', support: 'M17 120H193',
  },
  'neck-tilt': {
    label: 'Neck side tilt', head: [103, 22], headAngle: -22, face: 'right',
    body: 'M110 43L110 80', arms: 'M110 51L92 61L76 65 M110 51L128 61L145 65',
    legs: 'M110 80L93 119 M110 80L127 119',
  },
  'neck-rotation': {
    label: 'Neck rotation', head: [110, 22], headAngle: 0, face: 'left',
    body: 'M110 43L110 80', arms: 'M110 51L92 61L76 65 M110 51L128 61L145 65',
    legs: 'M110 80L93 119 M110 80L127 119',
  },
  'neck-chin': {
    label: 'Chin tuck / nod', head: [110, 25], headAngle: 20, face: 'right',
    body: 'M110 43L110 80', arms: 'M110 51L92 61L76 65 M110 51L128 61L145 65',
    legs: 'M110 80L93 119 M110 80L127 119',
  },
  'neck-supine': {
    label: 'Supported neck movement', head: [37, 91], headAngle: 10, face: 'left',
    body: 'M54 92L131 92', arms: 'M82 92L68 106 M100 92L112 105',
    legs: 'M131 92L158 92L178 101 M131 92L158 92L178 84',
    support: 'M17 120H193',
  },
  'standing-open': {
    label: 'Standing chest opener', head: [110, 22], body: 'M110 43L110 80',
    arms: 'M110 51L91 57L74 48 M110 51L129 57L146 48',
    legs: 'M110 80L92 119 M110 80L128 119',
  },
  'wall-chest': {
    label: 'Wall / doorway chest stretch', head: [103, 22], headAngle: -8,
    body: 'M110 43L111 81', arms: 'M110 51L91 42L90 20 M110 51L129 42L130 20',
    legs: 'M111 81L91 119 M111 81L129 119', support: 'M169 10V128',
  },
  'wall-wide': {
    label: 'Wide-handed wall chest stretch', head: [110, 22], body: 'M110 43Q112 62 111 81',
    arms: 'M110 51L91 54L157 47 M110 51L129 55L157 65',
    legs: 'M111 81L91 119 M111 81L129 119', support: 'M165 10V128',
  },
  'seated-chest': {
    label: 'Seated chest opener', head: [110, 22], body: 'M110 43L110 76',
    arms: 'M110 51L92 59L101 73 M110 51L128 59L119 73',
    legs: 'M110 76L143 80L151 118 M110 76L78 80L72 118',
    support: 'M62 82H157',
  },
  'seated-wide-chest': {
    label: 'Seated wide-arm chest opener', head: [110, 22], body: 'M110 43L110 76',
    arms: 'M110 51L91 51L72 50 M110 51L129 51L148 50',
    legs: 'M110 76L143 80L151 118 M110 76L78 80L72 118', support: 'M62 82H157',
  },
  'wall-chest-single': {
    label: 'Single-arm wall chest opener', head: [103, 22], headAngle: -7,
    body: 'M110 43Q112 62 111 81', arms: 'M110 51L132 55L157 55 M110 51L92 62L88 82',
    legs: 'M111 81L91 119 M111 81L129 119', support: 'M165 10V128',
  },
  'wall-chest-high': {
    label: 'High-arm wall chest stretch', head: [103, 22], headAngle: -8,
    body: 'M110 43L111 81', arms: 'M110 51L88 44L87 13 M110 51L129 57L145 68',
    legs: 'M111 81L91 119 M111 81L129 119', support: 'M163 10V128',
  },
  'corner-chest': {
    label: 'Corner chest stretch', head: [110, 22], body: 'M110 43Q110 63 111 81',
    arms: 'M110 51L91 42L86 22 M110 51L129 42L134 22',
    legs: 'M111 81L91 119 M111 81L129 119', support: 'M73 12V128M147 12V128',
  },
  'wall-forward': {
    label: 'Supported forward chest reach', head: [77, 41], headAngle: 14,
    body: 'M98 48Q87 62 77 76', arms: 'M94 56L124 60L158 61 M94 56L123 67L158 67',
    legs: 'M77 76L69 119 M77 76L108 79L117 119', support: 'M153 58V112M153 58H185',
  },
  'supine-open': {
    label: 'Supine chest opener', head: [37, 91], face: 'right',
    body: 'M54 92L130 92', arms: 'M82 92L67 73L48 68 M82 92L67 111L48 117',
    legs: 'M130 92L157 92L180 99 M130 92L157 92L180 85', support: 'M17 122H193',
  },
  'arm-overhead': {
    label: 'Overhead arm stretch', head: [110, 22], body: 'M110 43L110 80',
    arms: 'M110 51L94 39L98 12 M110 51L129 57L145 62',
    legs: 'M110 80L92 119 M110 80L128 119',
  },
  'arm-cross': {
    label: 'Cross-body arm stretch', head: [110, 22], body: 'M110 43L110 80',
    arms: 'M110 51L132 55L151 55 M110 51L91 60L124 59',
    legs: 'M110 80L92 119 M110 80L128 119',
  },
  'arm-back': {
    label: 'Arm-behind chest opener', head: [110, 22], body: 'M110 43L110 80',
    arms: 'M110 51L91 58L76 74 M110 51L128 58L148 67',
    legs: 'M110 80L92 119 M110 80L128 119', support: 'M63 54V86',
  },
  wrist: {
    label: 'Forearm and wrist stretch', head: [110, 22], body: 'M110 43L110 80',
    arms: 'M110 51L131 54L154 54 M110 51L91 60L132 60',
    legs: 'M110 80L92 119 M110 80L128 119',
  },
  'shoulder-external': {
    label: 'Shoulder external rotation', head: [110, 22], body: 'M110 43L110 80',
    arms: 'M110 51L94 59L94 74L82 74 M110 51L126 59L126 74L138 74',
    legs: 'M110 80L92 119 M110 80L128 119',
  },
  'forearm-rotation': {
    label: 'Elbow-tucked forearm rotation', head: [110, 22], body: 'M110 43L110 80',
    arms: 'M110 51L94 59L94 76L81 76 M110 51L126 59L126 76L139 76',
    legs: 'M110 80L92 119 M110 80L128 119',
  },
  'supine-butterfly': {
    label: 'Reclined butterfly hip rest', head: [37, 91], face: 'right',
    body: 'M54 92L130 92', arms: 'M82 92L72 107 M100 92L110 107',
    legs: 'M130 92L151 92L170 79L181 69 M130 92L151 92L170 105L181 115',
    support: 'M17 122H193',
  },
  'supine-reach': {
    label: 'Supine overhead reach', head: [37, 91], face: 'right',
    body: 'M54 92L130 92', arms: 'M82 92L67 75L53 59 M100 92L85 75L72 59',
    legs: 'M130 92L157 92L180 99 M130 92L157 92L180 85', support: 'M17 122H193',
  },
  'supine-side-reach': {
    label: 'Supine side-body reach', head: [37, 91], face: 'right',
    body: 'M54 92L130 92', arms: 'M82 92L66 77L48 76 M100 92L83 77L65 76',
    legs: 'M130 92L154 91L176 83 M130 92L154 93L176 101', support: 'M17 122H193',
  },
  'shin-wall': {
    label: 'Wall-supported shin and ankle stretch', head: [81, 22], headAngle: 10,
    body: 'M104 43Q94 60 86 78', arms: 'M99 51L128 50L153 48 M99 51L127 57L153 58',
    legs: 'M86 78L75 119 M86 78L115 83L119 118', support: 'M159 12V128',
  },
  'seated-rib-expansion': {
    label: 'Seated rib expansion', head: [110, 22], body: 'M110 43L110 76',
    arms: 'M110 51L96 60L103 70 M110 51L124 60L117 70',
    legs: 'M110 76L142 82L151 117 M110 76L78 82L72 117', support: 'M62 82H157',
  },
  'seated-pelvic-rock': {
    label: 'Seated pelvic rock', head: [110, 22], body: 'M110 43Q105 60 110 76',
    arms: 'M110 51L94 61L96 79 M110 51L126 61L124 79',
    legs: 'M110 76L142 82L151 117 M110 76L78 82L72 117', support: 'M62 82H157',
  },
  'kneeling-front-body': {
    label: 'Upright kneeling front-body stretch', head: [110, 22], body: 'M110 43L110 76',
    arms: 'M110 51L92 62L88 81 M110 51L128 62L132 81',
    legs: 'M110 76L92 94L69 94 M110 76L129 94L152 94', support: 'M17 117H194',
  },
  'quadruped-side-reach': {
    label: 'All-fours side reach', head: [49, 63], face: 'left',
    body: 'M63 68Q103 58 145 68', arms: 'M80 65L76 88L69 104 M92 64L109 63L129 60',
    legs: 'M143 68L151 88L145 104 M143 68L169 82L174 103', support: 'M17 115H194',
  },
  sleeper: {
    label: 'Side-lying shoulder stretch', head: [54, 83], face: 'left',
    body: 'M69 85L146 85', arms: 'M95 85L112 66L136 66 M112 66L123 54L140 61',
    legs: 'M146 85L164 97L183 97 M146 85L164 108L183 109', support: 'M17 120H193',
  },
  'standing-relaxed': {
    label: 'Relaxed shoulder movement', head: [110, 22], body: 'M110 43L110 80',
    arms: 'M110 51L92 63L87 83 M110 51L130 62L133 82',
    legs: 'M110 80L92 119 M110 80L128 119',
  },
  'shoulder-pendulum': {
    label: 'Supported relaxed arm pendulum', head: [83, 22], body: 'M103 43Q92 60 84 78',
    arms: 'M99 51L125 51L151 51 M99 51L108 65L108 91',
    legs: 'M84 78L77 119 M84 78L117 82L119 119', support: 'M151 8V128',
  },
  child: {
    label: 'Child’s pose reach', head: [67, 96], face: 'left',
    body: 'M89 74L64 96L42 104', arms: 'M81 82L58 91L27 91 M81 82L67 101L32 101',
    legs: 'M89 74L113 91L143 91 M113 91L151 103', support: 'M16 117H194',
  },
  quadruped: {
    label: 'Hands-and-knees back stretch', head: [49, 63], face: 'left',
    body: 'M63 68Q103 58 145 68', arms: 'M80 65L76 88L69 104 M92 64L96 87L100 104',
    legs: 'M143 68L151 88L145 104 M143 68L169 82L174 103',
    support: 'M17 115H194',
  },
  'kneeling-side': {
    label: 'Kneeling side-body reach', head: [102, 23], headAngle: -8,
    body: 'M110 43Q106 60 101 75', arms: 'M110 51L92 40L80 13 M110 51L128 61L145 70',
    legs: 'M101 75L87 91L65 91 M101 75L124 91L148 91', support: 'M17 117H194',
  },
  'quadruped-reach': {
    label: 'All-fours long reach', head: [49, 63], face: 'left',
    body: 'M63 68Q103 58 145 68', arms: 'M80 65L76 88L69 104 M92 64L104 54L126 44',
    legs: 'M143 68L151 88L145 104 M143 68L169 82L174 103', support: 'M17 115H194',
  },
  'quadruped-adductor': {
    label: 'All-fours side-leg rock-back', head: [49, 63], face: 'left',
    body: 'M63 68Q103 58 145 68', arms: 'M80 65L76 88L69 104 M92 64L96 87L100 104',
    legs: 'M143 68L151 88L145 104 M143 68L168 73L187 73', support: 'M17 115H194',
  },
  'child-side-reach': {
    label: 'Side-walked child’s pose', head: [67, 96], face: 'left',
    body: 'M89 74L64 96L42 104', arms: 'M81 82L58 87L27 80 M81 82L62 94L32 88',
    legs: 'M89 74L113 91L143 91 M113 91L151 103', support: 'M16 117H194',
  },
  'thread-needle': {
    label: 'Thread-the-needle rotation', head: [48, 67], face: 'left',
    body: 'M63 71Q104 60 145 69', arms: 'M80 68L83 86L130 91 M95 66L108 83L130 91',
    legs: 'M143 69L151 89L145 104 M143 69L169 83L174 103',
    support: 'M17 115H194',
  },
  'kneeling-supported': {
    label: 'Kneeling supported forward reach', head: [77, 44], headAngle: 12,
    body: 'M98 50Q104 65 111 79', arms: 'M98 56L127 59L158 59 M98 56L127 66L158 66',
    legs: 'M111 79L99 97L75 97 M111 79L126 97L151 97', support: 'M154 57V116M154 57H184',
  },
  'supported-forward': {
    label: 'Supported forward reach', head: [77, 41], headAngle: 15,
    body: 'M98 48Q87 62 77 76', arms: 'M94 56L124 60L158 61 M94 56L123 67L158 67',
    legs: 'M77 76L69 119 M77 76L108 79L117 119', support: 'M153 58V112M153 58H185',
  },
  'seated-twist': {
    label: 'Seated upper-body twist', head: [110, 22], headAngle: -9,
    body: 'M110 43L105 78', arms: 'M108 51L126 60L144 52 M108 51L90 61L116 72',
    legs: 'M105 78L141 81L151 116 M105 78L77 82L72 116', support: 'M62 82H157',
  },
  'side-bend': {
    label: 'Side-body reach', head: [96, 21], headAngle: -10,
    body: 'M108 43Q101 61 93 79', arms: 'M106 51L88 41L77 14 M106 51L126 57L146 68',
    legs: 'M93 79L78 119 M93 79L118 119',
  },
  sphinx: {
    label: 'Supported front-body stretch', head: [43, 70], face: 'left',
    body: 'M58 77Q80 64 104 84L137 96', arms: 'M76 72L72 99L89 104 M88 73L94 96L111 101',
    legs: 'M137 96L163 98L184 99 M137 96L163 100L184 103', support: 'M17 119H194',
  },
  'prone-rest': {
    label: 'Prone relaxed rest', head: [43, 70], face: 'left',
    body: 'M58 77L137 88', arms: 'M77 75L73 93L70 106 M94 79L92 95L91 107',
    legs: 'M137 88L162 89L185 89 M137 89L162 92L185 93', support: 'M17 119H194',
  },
  'supine-knee-hug': {
    label: 'Supine knee-to-chest stretch', head: [37, 91], face: 'right',
    body: 'M54 92L130 92', arms: 'M82 92L109 78L131 78 M104 89L124 76L139 81',
    legs: 'M130 92L153 84L141 63 M141 63L123 64L117 78 M130 92L157 94L181 99',
    support: 'M17 121H193',
  },
  'supine-twist': {
    label: 'Supine spinal rotation', head: [37, 91], face: 'right',
    body: 'M54 92L130 92', arms: 'M83 92L68 76L51 73 M83 92L68 108L51 112',
    legs: 'M130 92L153 86L171 74 M130 92L151 96L169 108', support: 'M17 122H193',
  },
  'supine-adductor': {
    label: 'Supine inner-hip stretch', head: [37, 91], face: 'right',
    body: 'M54 92L130 92', arms: 'M82 92L72 107 M100 92L110 107',
    legs: 'M130 92L151 91L167 75L180 65 M130 92L151 93L167 109L180 119', support: 'M17 122H193',
  },
  'supine-figure4': {
    label: 'Supine figure-four hip stretch', head: [37, 91], face: 'right',
    body: 'M54 92L130 92', arms: 'M83 92L108 78L131 77 M103 91L119 78L138 81',
    legs: 'M130 92L153 92L174 104 M153 92L147 72L128 70 M147 72L162 70',
    support: 'M17 122H193',
  },
  'supine-leg-raise': {
    label: 'Supine hamstring raise', head: [37, 91], face: 'right',
    body: 'M54 92L130 92', arms: 'M83 92L102 79L121 77 M95 92L114 81L124 78',
    legs: 'M130 92L152 92L177 93 M130 92L149 70L150 34', support: 'M17 122H193',
  },
  'supine-bent-hamstring': {
    label: 'Supine bent-knee hamstring stretch', head: [37, 91], face: 'right',
    body: 'M54 92L130 92', arms: 'M82 92L107 74L132 64 M100 92L117 77L138 67',
    legs: 'M130 92L154 92L178 101 M130 92L149 73L157 53L137 45', support: 'M17 122H193',
  },
  'seated-hamstring': {
    label: 'Seated hamstring hinge', head: [83, 48], headAngle: 25,
    body: 'M103 50L94 79', arms: 'M99 57L119 71L148 99 M99 57L115 76L149 100',
    legs: 'M94 79L137 82L174 82 M94 79L77 93L77 119', support: 'M17 121H194',
  },
  'standing-hinge': {
    label: 'Standing hamstring hinge', head: [72, 39], headAngle: 25,
    body: 'M96 46Q84 61 75 76', arms: 'M91 54L117 72L137 91 M91 54L113 76L139 92',
    legs: 'M75 76L68 119 M75 76L109 80L118 119',
  },
  'standing-elevated-hamstring': {
    label: 'Supported standing hamstring stretch', head: [110, 22], body: 'M110 43L110 78',
    arms: 'M110 51L91 60L79 67 M110 51L128 59L149 59',
    legs: 'M110 78L94 118 M110 78L132 86L151 86', support: 'M149 82H185M159 48V92',
  },
  'half-split': {
    label: 'Half-split hamstring stretch', head: [103, 33], headAngle: 15,
    body: 'M111 50L111 77', arms: 'M111 55L94 72L78 86 M111 55L128 73L144 86',
    legs: 'M111 77L94 90L71 90L50 90 M94 90L119 103L146 103', support: 'M17 118H194',
  },
  lunge: {
    label: 'Supported hip-flexor lunge', head: [106, 21], body: 'M110 42L108 75',
    arms: 'M110 51L95 66L88 79 M110 51L125 66L131 79',
    legs: 'M108 75L78 83L63 116 M108 75L133 81L166 81',
  },
  butterfly: {
    label: 'Seated butterfly hip stretch', head: [110, 22], body: 'M110 43L110 76',
    arms: 'M110 52L96 69L89 88 M110 52L124 69L131 88',
    legs: 'M110 76L91 84L75 100L97 113 M110 76L129 84L145 100L123 113',
    support: 'M17 122H193',
  },
  'standing-figure4': {
    label: 'Standing figure-four hip stretch', head: [110, 22], body: 'M110 43L110 78',
    arms: 'M110 52L93 61L76 67 M110 52L126 61L143 67',
    legs: 'M110 78L94 118 M110 78L131 86L115 69L97 73', support: 'M164 42V121',
  },
  'standing-hip-circle': {
    label: 'Supported standing hip circle', head: [110, 22], body: 'M110 43L110 78',
    arms: 'M110 51L91 59L75 59 M110 51L128 59L147 59',
    legs: 'M110 78L94 118 M110 78L132 88L151 72L155 85', support: 'M72 39V121',
  },
  'standing-quad': {
    label: 'Standing quadriceps and hip stretch', head: [110, 22], body: 'M110 43L110 78',
    arms: 'M110 52L92 61L76 65 M110 52L127 61L138 77L122 88',
    legs: 'M110 78L94 118 M110 78L131 88L122 106L109 104', support: 'M73 42V121',
  },
  'calf-wall': {
    label: 'Wall-supported calf stretch', head: [81, 22], headAngle: 12,
    body: 'M104 43Q94 60 86 78', arms: 'M99 51L128 50L153 48 M99 51L127 57L153 58',
    legs: 'M86 78L75 119 M86 78L116 82L119 119', support: 'M159 12V128',
  },
  'step-calf': {
    label: 'Step-supported calf stretch', head: [110, 22], body: 'M110 43L110 77',
    arms: 'M110 51L92 59L76 62 M110 51L127 59L144 62',
    legs: 'M110 77L94 105L86 111 M110 77L126 105L133 118',
    support: 'M72 112H157M163 48V112',
  },
  'seated-calf': {
    label: 'Seated calf and ankle stretch', head: [110, 22], body: 'M110 43L110 76',
    arms: 'M110 52L94 69L120 101 M110 52L127 69L153 101',
    legs: 'M110 76L142 82L172 82 M110 76L84 83L84 116', support: 'M17 120H194',
  },
  'down-dog': {
    label: 'Downward-facing calf stretch', head: [57, 82], face: 'left',
    body: 'M71 78L110 44L145 78', arms: 'M78 73L57 98L39 115 M85 67L73 94L58 115',
    legs: 'M145 78L164 97L185 115 M145 78L136 101L123 115',
    support: 'M17 122H194',
  },
  'seated-forward': {
    label: 'Seated forward stretch', head: [78, 46], headAngle: 24,
    body: 'M100 49Q88 64 78 80', arms: 'M96 58L115 76L135 91 M96 58L112 78L139 93',
    legs: 'M78 80L54 85L40 113 M78 80L111 83L144 83', support: 'M17 122H194',
  },
  'seated-figure4': {
    label: 'Seated figure-four hip stretch', head: [110, 22], body: 'M110 43L110 76',
    arms: 'M110 52L96 69L115 82 M110 52L125 69L143 82',
    legs: 'M110 76L143 80L151 116 M110 76L83 83L111 68L129 72', support: 'M63 82H157',
  },
  'standing-side': {
    label: 'Standing side-body stretch', head: [98, 22], headAngle: -8,
    body: 'M108 43Q99 62 94 79', arms: 'M105 51L90 40L80 13 M105 51L126 59L144 72',
    legs: 'M94 79L81 119 M94 79L118 119',
  },
  'supine-rest': {
    label: 'Supported resting position', head: [37, 91], face: 'right',
    body: 'M54 92L130 92', arms: 'M82 92L72 108 M100 92L110 108',
    legs: 'M130 92L157 90L177 73 M130 92L157 94L177 111', support: 'M17 122H193M157 67V121',
  },
}

function poseForStretch(stretch) {
  const name = stretch.name.toLowerCase()
  const group = stretch.muscleGroup

  if (group === 'neck') {
    if (/supine chin nod/.test(name)) return 'neck-supine-nod'
    if (/supine.*rotation/.test(name)) return 'neck-supine'
    if (/wall-supported chin glide/.test(name)) return 'neck-wall-retraction'
    if (/neutral neck breathing|shoulder-down|lengthening reach/.test(name)) return 'neck-neutral'
    if (/shoulder-anchored|upper trapezius/.test(name)) return 'neck-anchor'
    if (/levator|diagonal/.test(name)) return 'neck-diagonal'
    if (/side-to-side neck glide/.test(name)) return 'neck-glide'
    if (/chin tuck/.test(name)) return 'neck-seated-retraction'
    if (/chin glide/.test(name)) return 'neck-retraction'
    if (/seated.*rotation|easy neck rotation/.test(name)) return 'neck-seated-rotation'
    if (/rotation|turn/.test(name)) return 'neck-rotation'
    if (/chin-to-chest|supported neck flexion|relaxed neck flexion/.test(name)) return 'neck-seated-flexion'
    if (/chin|nod|flexion/.test(name)) return 'neck-chin'
    return 'neck-seated-tilt'
  }

  if (group === 'chest') {
    if (/prone|cobra/.test(name)) return 'sphinx'
    if (/side-lying/.test(name)) return 'side-lying-open'
    if (/snow angel/.test(name)) return 'supine-reach'
    if (/supine/.test(name)) return 'supine-open'
    if (/seated.*(hands-clasped|towel|chair-back)/.test(name)) return 'seated-chest'
    if (/seated wide-arm/.test(name)) return 'seated-wide-chest'
    if (/seated/.test(name)) return 'seated-chest'
    if (/kneeling|bench/.test(name)) return 'kneeling-supported'
    if (/behind-the-back/.test(name)) return 'arm-back'
    if (/single-arm|palm-back/.test(name)) return 'wall-chest-single'
    if (/standing high-arm/.test(name)) return 'wall-chest-high'
    if (/standing low-arm/.test(name)) return 'wall-chest-single'
    if (/corner/.test(name)) return 'corner-chest'
    if (/wall-supported wide/.test(name)) return 'wall-wide'
    if (/low doorframe/.test(name)) return 'wall-forward'
    if (/wall|doorway|corner|palm/.test(name)) return 'wall-chest'
    return 'standing-open'
  }

  if (group === 'shoulders') {
    if (name.includes('sleeper')) return 'sleeper'
    if (name.includes('child')) return 'child'
    if (/supine shoulder flexion/.test(name)) return 'supine-reach'
    if (/supine/.test(name)) return 'supine-open'
    if (/doorframe shoulder rotation/.test(name)) return 'shoulder-external'
    if (/pendulum/.test(name)) return 'shoulder-pendulum'
    if (/wall shoulder slide|wall-assisted shoulder flexion/.test(name)) return 'wall-slide'
    if (/arms-behind|extension/.test(name)) return 'arm-back'
    if (/seated shoulder blade reach/.test(name)) return 'seated-blade-reach'
    if (/roll/.test(name)) return 'standing-relaxed'
    if (/external rotation/.test(name)) return 'shoulder-external'
    if (/cross|eagle|hug|blade/.test(name)) return 'arm-cross'
    if (/table|wall|support/.test(name)) return 'supported-forward'
    if (/overhead|side-reach|flexion/.test(name)) return 'arm-overhead'
    return 'arm-cross'
  }

  if (group === 'upperArms') {
    if (/cross-body/.test(name)) return 'arm-cross'
    if (/seated/.test(name)) return 'seated-overhead'
    if (/kneeling/.test(name)) return 'kneeling-overhead'
    if (/wall-assisted triceps lean/.test(name)) return 'arm-overhead'
    if (/biceps|palm|doorframe|wall|straight-arm/.test(name)) return 'arm-back'
    return 'arm-overhead'
  }

  if (group === 'forearms') {
    if (/forearm rotation/.test(name)) return 'forearm-rotation'
    if (/prayer/.test(name)) return 'prayer-wrist'
    if (/seated|tabletop|desk/.test(name)) return 'seated-wrist'
    if (/wall/.test(name)) return 'wall-wrist'
    return 'wrist'
  }

  if (group === 'upperBack') {
    if (/child.*side walk/.test(name)) return 'child-side-reach'
    if (name.includes('child')) return 'child'
    if (name.includes('thread')) return 'thread-needle'
    if (/cat-cow|all-fours|quadruped/.test(name)) return 'quadruped'
    if (/open-book/.test(name)) return 'supine-twist'
    if (/standing.*rotation/.test(name)) return 'standing-twist'
    if (/seated.*(turn|rotation)/.test(name)) return 'seated-twist'
    if (/seated/.test(name)) return 'seated-forward'
    if (/kneeling side|side-body/.test(name)) return 'kneeling-side'
    if (/self-hug|hug|clasped/.test(name)) return 'arm-cross'
    if (/wall thoracic extension/.test(name)) return 'supported-forward'
    if (/wall|table|doorframe/.test(name)) return 'supported-forward'
    if (/towel|supine/.test(name)) return 'supine-open'
    return 'arm-cross'
  }

  if (group === 'lowerBack') {
    if (/chair-supported forward rest/.test(name)) return 'supported-forward'
    if (/constructive|resting/.test(name)) return 'supine-rest'
    if (/figure-four/.test(name)) return 'supine-figure4'
    if (/seated pelvic/.test(name)) return 'seated-pelvic-rock'
    if (/pelvic tilt|pelvic rock/.test(name)) return 'pelvic-tilt'
    if (/knees-to-chest|single-knee hug|knee hug/.test(name)) return 'supine-knee-hug'
    if (/rotation|one-side|sway|knees-to-one-side/.test(name)) return 'supine-twist'
    if (name.includes('child')) return 'child'
    if (/kneeling|all-fours/.test(name)) return 'quadruped'
    if (/seated side/.test(name)) return 'seated-side-reach'
    if (/seated/.test(name)) return 'seated-forward'
    if (/side[- ]bend/.test(name)) return 'side-bend'
    if (/standing supported|supported back lengthener/.test(name)) return 'supported-forward'
    return 'supine-knee-hug'
  }

  if (group === 'core') {
    if (/prone abdominal rest/.test(name)) return 'prone-rest'
    if (/kneeling supported front-body/.test(name)) return 'kneeling-front-body'
    if (/sphinx|cobra|prone/.test(name)) return 'sphinx'
    if (/supine knee-down rotation/.test(name)) return 'supine-twist'
    if (/twist|rotation|trunk turn/.test(name)) return /standing/.test(name) ? 'standing-twist' : 'seated-twist'
    if (/all-fours long reach/.test(name)) return 'quadruped-reach'
    if (/all-fours side-to-side reach/.test(name)) return 'quadruped-side-reach'
    if (/kneeling side reach/.test(name)) return 'kneeling-side'
    if (/all-fours|kneeling/.test(name)) return 'quadruped'
    if (/side-lying/.test(name)) return 'side-lying-open'
    if (/seated rib expansion/.test(name)) return 'seated-rib-expansion'
    if (/seated.*(side|crescent)/.test(name)) return 'seated-side-reach'
    if (/supine side reach/.test(name)) return 'supine-side-reach'
    if (/supine overhead/.test(name)) return 'supine-reach'
    if (/supine|reclined|lying/.test(name)) return /knee-down/.test(name) ? 'supine-twist' : 'supine-open'
    if (/side|crescent/.test(name)) return 'standing-side'
    return 'standing-side'
  }

  if (group === 'hips') {
    if (/side-lying quad/.test(name)) return 'side-lying-quad'
    if (/standing glute stretch/.test(name)) return 'standing-figure4'
    if (/reclined butterfly/.test(name)) return 'supine-butterfly'
    if (/standing hip flexor reach/.test(name)) return 'lunge'
    if (/supine knee-to-opposite/.test(name)) return 'supine-knee-hug'
    if (/supine hip external/.test(name)) return 'supine-figure4'
    if (/supine hip adductor/.test(name)) return 'supine-adductor'
    if (/adductor rock-back/.test(name)) return 'quadruped-adductor'
    if (/seated outer-hip cross/.test(name)) return 'seated-figure4'
    if (/half-kneeling side hip reach/.test(name)) return 'kneeling-side'
    if (/supported standing hip circles/.test(name)) return 'standing-hip-circle'
    if (/wide-knee child/.test(name)) return 'child'
    if (/butterfly|adductor|wide-knee/.test(name)) return 'butterfly'
    if (/figure-four/.test(name) && /standing/.test(name)) return 'standing-figure4'
    if (/figure-four/.test(name) && /seated/.test(name)) return 'seated-figure4'
    if (/figure-four/.test(name)) return 'supine-figure4'
    if (/pigeon/.test(name)) return 'pigeon'
    if (/lunge|kneeling|half-kneeling/.test(name)) return 'lunge'
    if (/quad/.test(name)) return 'standing-quad'
    if (/seated/.test(name)) return 'seated-forward'
    if (/side-reach/.test(name)) return 'standing-side'
    return 'butterfly'
  }

  if (group === 'hamstrings') {
    if (/bent-knee hamstring/.test(name)) return 'supine-bent-hamstring'
    if (/supported chair hamstring/.test(name)) return 'seated-hamstring'
    if (/elevated heel hamstring/.test(name)) return 'standing-elevated-hamstring'
    if (/standing supported hamstring reach/.test(name)) return 'standing-hinge'
    if (/seated/.test(name)) return 'seated-hamstring'
    if (/supine|wall-supported|wall rest|single-leg|strap|towel|doorway/.test(name)) return 'supine-leg-raise'
    if (/half-split|kneeling/.test(name)) return 'half-split'
    return 'standing-hinge'
  }

  if (group === 'calves') {
    if (/wall toe-up shin/.test(name)) return 'shin-wall'
    if (/towel-assisted soleus/.test(name)) return 'seated-calf'
    if (/seated|chair/.test(name)) return 'seated-calf'
    if (/ankle mobility|toe-up|heel-down ankle|point and flex/.test(name)) return 'ankle-glide'
    if (/step|heel-drop/.test(name)) return 'step-calf'
    if (/downward dog/.test(name)) return 'down-dog'
    if (/relaxed calf rock/.test(name)) return 'standing-relaxed'
    return 'calf-wall'
  }

  return 'standing-open'
}

function firstPathPoint(path) {
  const match = path.match(/^M\s*(-?\d+(?:\.\d+)?)\s*,?\s*(-?\d+(?:\.\d+)?)/)
  return match ? [Number(match[1]), Number(match[2])] : [110, 51]
}

function lastPathPoint(path) {
  const values = path.match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? []
  return values.length >= 2 ? values.slice(-2) : [110, 80]
}

function neckConnector(pose) {
  const [baseX, baseY] = firstPathPoint(pose.body)
  const [headX, headY] = pose.head
  const dx = headX - baseX
  const dy = headY - baseY
  const distance = Math.hypot(dx, dy) || 1
  const endX = headX - (dx / distance) * 10
  const endY = headY - (dy / distance) * 10
  return `M${baseX} ${baseY}L${endX.toFixed(1)} ${endY.toFixed(1)}`
}

function movementTargetFor(stretch) {
  const name = stretch.name.toLowerCase()
  const group = stretch.muscleGroup
  if (group === 'neck') return 'head'
  if (group === 'chest') return /chest sweep|snow angel|seated hands-clasped|seated wide-arm|seated towel|chair-back chest|behind-the-back chest|supine towel/.test(name) ? 'arms' : 'torso'
  if (group === 'shoulders') return /doorframe shoulder rotation/.test(name) ? 'torso' : 'arms'
  if (group === 'upperArms' || group === 'forearms') return 'arms'
  if (group === 'lowerBack' && /knees-to-chest|rotation|figure-four|knee hug|sway|one-side/.test(name)) return 'legs'
  if (group === 'core' && /supine knee-down rotation/.test(name)) return 'legs'
  if (group === 'core' && /supine overhead|side-lying open reach|all-fours long reach|all-fours side-to-side reach/.test(name)) return 'arms'
  if (group === 'hamstrings') return /supine|wall-supported|wall rest|doorway|strap|towel/.test(name) && !/seated/.test(name) ? 'legs' : 'torso'
  if (group === 'calves') return /seated|chair|towel|step|heel-drop|downward dog|ankle|point|flex|circles|rock/.test(name) ? 'legs' : 'torso'
  if (group === 'hips' && /side hip reach|adductor rock-back|seated hip hinge/.test(name)) return 'torso'
  if (['upperBack', 'lowerBack', 'core'].includes(group)) return 'torso'
  return 'legs'
}
export default function StretchModal({ stretch, isQueued, onClose, onStart }) {
  const [motionEnabled, setMotionEnabled] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return true
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })
  if (!stretch) return null
  const poseKey = poseForStretch(stretch)
  const pose = POSES[poseKey] ?? POSES['standing-open']
  const [headX, headY] = pose.head
  const faceDirection = pose.face === 'left' ? -1 : 1
  const movementTarget = movementTargetFor(stretch)
  const movementPivot = movementTarget === 'head'
    ? firstPathPoint(pose.body)
    : movementTarget === 'arms'
      ? firstPathPoint(pose.arms)
      : movementTarget === 'legs'
        ? firstPathPoint(pose.legs)
        : lastPathPoint(pose.body)
  const movementStyle = { transformOrigin: `${movementPivot[0]}px ${movementPivot[1]}px` }
  const legsPart = (
    <g
      className={movementTarget === 'legs' ? 'pose-motion pose-motion-legs' : undefined}
      style={movementTarget === 'legs' ? movementStyle : undefined}
    >
      <path className="pose-limbs" d={pose.legs} />
    </g>
  )
  const armsPart = (
    poseKey === 'forearm-rotation' && movementTarget === 'arms'
      ? <>
          <path className="pose-limbs" d="M110 51L94 59L94 76L81 76 M110 51L126 59" />
          <g className="pose-motion pose-motion-arms" style={{ transformOrigin: '126px 59px' }}>
            <path className="pose-limbs" d="M126 59L126 76L139 76" />
          </g>
        </>
      : <g
          className={movementTarget === 'arms' ? 'pose-motion pose-motion-arms' : undefined}
          style={movementTarget === 'arms' ? movementStyle : undefined}
        >
          <path className="pose-limbs" d={pose.arms} />
        </g>
  )
  const headPart = (
    <g
      className={movementTarget === 'head' ? 'pose-motion pose-motion-head' : undefined}
      style={movementTarget === 'head' ? movementStyle : undefined}
    >
      <path className="pose-neck" d={neckConnector(pose)} />
      <g transform={`rotate(${pose.headAngle ?? 0} ${headX} ${headY})`}>
        <circle className="pose-head" cx={headX} cy={headY} r="10" />
        <path
          className="pose-face"
          d={`M ${headX + 7 * faceDirection} ${headY + 1} l ${3 * faceDirection} 1`}
        />
      </g>
    </g>
  )
  const torsoAndUpperBody = (
    <>
      <path className="pose-torso" d={pose.body} />
      {armsPart}
      {headPart}
    </>
  )
  const poseFigure = (
    <>
      {legsPart}
      {movementTarget === 'torso'
        ? <g className="pose-motion pose-motion-torso" style={movementStyle}>{torsoAndUpperBody}</g>
        : torsoAndUpperBody}
    </>
  )
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        className="modal card"
        role="dialog"
        aria-modal="true"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close stretch details">
          ×
        </button>
        <span className="badge">
          {stretch.area} · {stretch.difficulty} · {stretch.duration} sec
        </span>
        <h2>{stretch.name}</h2>
        <p className="modal-muscle">{stretch.muscle}</p>
        <p className="modal-benefit">{stretch.helpsWith}</p>
        <figure className="demo-figure">
          <svg
            className={`pose-illustration${motionEnabled ? " motion-active" : ""}`}
            data-pose={poseKey}
            data-motion={movementTarget}
            viewBox="0 0 220 145"
            role="img"
            aria-label={`${stretch.name} animated movement illustration`}
          >
            {pose.support && <path className="pose-support" d={pose.support} />}
            {poseFigure}
          </svg>
          <figcaption>{pose.label}</figcaption>
          <button
            type="button"
            className="motion-toggle"
            aria-pressed={motionEnabled}
            onClick={() => setMotionEnabled((enabled) => !enabled)}
          >
            {motionEnabled ? 'Pause motion' : 'Play motion'}
          </button>
        </figure>
        <div className="modal-columns">
          <div>
            <p className="eyebrow">HOW TO EXECUTE</p>
            <p>{stretch.instructions}</p>
          </div>
          <div>
            <p className="eyebrow">FORM CHECKLIST</p>
            <ul>
              {stretch.cues.map((cue) => (
                <li key={cue}>{cue}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="stretch-warning">
          <strong>Move safely:</strong> {stretch.warning}
        </p>
        <button
          className={`flow-add-button modal-start${isQueued ? ' flow-added' : ''}`}
          onClick={() => onStart(stretch)}
          aria-pressed={isQueued}
        >
          {isQueued ? '✓ Added · remove' : '＋ Add flow'}
        </button>
      </section>
    </div>
  )
}
