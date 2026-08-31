from __future__ import annotations

import base64
import gzip
import re
from pathlib import Path

from PIL import Image
from reportlab.lib.pagesizes import A4, landscape
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / '.manual-source'
DOWNLOADS = ROOT / 'downloads'
ASSETS = ROOT / 'assets' / 'img'
DOWNLOADS.mkdir(parents=True, exist_ok=True)

REGULAR = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
BOLD = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
MONO = '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'
pdfmetrics.registerFont(TTFont('DV', REGULAR))
pdfmetrics.registerFont(TTFont('DV-Bold', BOLD))
pdfmetrics.registerFont(TTFont('DV-Mono', MONO))

CONFIG = {
    'pt': {
        'src': 'pt.txt.gz.b64',
        'out': 'Printly_Manual_Oficial_v0.2.8.3_REV6_PT-BR.pdf',
        'manual': 'MANUAL OFICIAL DE OPERAÇÃO',
        'lang': 'Português (Brasil)',
        'page': 'Página',
    },
    'en': {
        'src': 'en.txt.gz.b64',
        'out': 'Printly_Official_Operations_Manual_v0.2.8.3_REV6_EN-US.pdf',
        'manual': 'OFFICIAL OPERATIONS MANUAL',
        'lang': 'English (US)',
        'page': 'Page',
    },
    'es': {
        'src': 'es.txt.gz.b64',
        'out': 'Printly_Manual_Oficial_de_Operacion_v0.2.8.3_REV6_ES.pdf',
        'manual': 'MANUAL OFICIAL DE OPERACIÓN',
        'lang': 'Español',
        'page': 'Página',
    },
}

# Reuse real Printly screenshots already published with the site. The manual remains
# illustrated in all languages without duplicating large binary assets in the repo.
PAGE_IMAGES = {
    1: 'printly-logo.jpg',
    4: 'screen-dashboard.webp',
    6: 'screen-configuracoes.webp',
    8: 'screen-configuracoes.webp',
    9: 'screen-configuracoes.webp',
    10: 'screen-configuracoes.webp',
    11: 'screen-dashboard.webp',
    13: 'screen-materiais.webp',
    14: 'screen-materiais.webp',
    16: 'screen-materiais.webp',
    18: 'screen-impressoras.webp',
    20: 'screen-produtos.webp',
    21: 'screen-produtos.webp',
    22: 'screen-produtos.webp',
    23: 'screen-orcamento-edit.webp',
    24: 'screen-stl.webp',
    25: 'screen-stl.webp',
    26: 'screen-orcamento-edit.webp',
    27: 'screen-orcamento-edit.webp',
    28: 'screen-orcamento.webp',
    29: 'screen-orcamento.webp',
    30: 'screen-orcamento.webp',
    32: 'screen-producao.webp',
    34: 'screen-alertas.webp',
    36: 'screen-relatorios.webp',
    37: 'screen-relatorios.webp',
    38: 'screen-relatorios.webp',
    40: 'screen-sobre.webp',
    43: 'screen-dashboard.webp',
    44: 'screen-dashboard.webp',
    45: 'screen-sobre.webp',
}

W, H = landscape(A4)
MARGIN_X = 38
TOP = H - 42
BOTTOM = 34
BLUE = (0.02, 0.42, 0.78)
NAVY = (0.02, 0.09, 0.17)
MID = (0.30, 0.38, 0.45)
LIGHT = (0.88, 0.94, 0.98)


def decode_source(path: Path) -> str:
    raw = ''.join(path.read_text(encoding='ascii').split())
    return gzip.decompress(base64.b64decode(raw)).decode('utf-8')


def clean_page(text: str) -> list[str]:
    lines = []
    for original in text.replace('\r', '').splitlines():
        line = original.rstrip()
        if re.search(r'PRINTLY\s*[•·-].*v0\.2\.8\.3', line, flags=re.I):
            continue
        if re.search(r'\b(Página|Page)\s+\d+\s*$', line, flags=re.I):
            continue
        # Preserve table structure, but remove extreme padding produced by pdftotext.
        line = re.sub(r' {8,}', '    ', line)
        lines.append(line)
    while lines and not lines[0].strip():
        lines.pop(0)
    while lines and not lines[-1].strip():
        lines.pop()
    return lines


def wrap_line(line: str, max_chars: int) -> list[str]:
    if not line.strip():
        return ['']
    indent = len(line) - len(line.lstrip(' '))
    prefix = ' ' * min(indent, 8)
    words = line.strip().split()
    if not words:
        return ['']
    out, current = [], prefix
    for word in words:
        candidate = (current + (' ' if current.strip() else '') + word)
        if len(candidate) <= max_chars:
            current = candidate
        else:
            if current.strip():
                out.append(current)
            current = prefix + word
    if current.strip():
        out.append(current)
    return out or ['']


def draw_contain_image(c: canvas.Canvas, path: Path, x: float, y: float, w: float, h: float) -> None:
    with Image.open(path) as im:
        iw, ih = im.size
    scale = min(w / iw, h / ih)
    dw, dh = iw * scale, ih * scale
    dx, dy = x + (w - dw) / 2, y + (h - dh) / 2
    c.setFillColorRGB(*LIGHT)
    c.roundRect(x - 4, y - 4, w + 8, h + 8, 8, fill=1, stroke=0)
    c.drawImage(str(path), dx, dy, width=dw, height=dh, preserveAspectRatio=True, mask='auto')
    c.setStrokeColorRGB(0.76, 0.84, 0.90)
    c.roundRect(x - 4, y - 4, w + 8, h + 8, 8, fill=0, stroke=1)


def header_footer(c: canvas.Canvas, cfg: dict, pno: int) -> None:
    c.setFillColorRGB(*NAVY)
    c.setFont('DV-Bold', 7.2)
    c.drawString(MARGIN_X, H - 20, f"PRINTLY · {cfg['manual']} · v0.2.8.3")
    c.setFillColorRGB(*MID)
    c.setFont('DV', 7)
    c.drawRightString(W - MARGIN_X, 18, f"{cfg['page']} {pno} · REV6 · IcoLabs")


def draw_cover(c: canvas.Canvas, cfg: dict, lines: list[str]) -> None:
    c.setFillColorRGB(1, 1, 1)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    logo = ASSETS / 'printly-logo.jpg'
    if logo.exists():
        draw_contain_image(c, logo, W * 0.18, H * 0.60, W * 0.64, H * 0.25)
    c.setFillColorRGB(*NAVY)
    c.setFont('DV-Bold', 24)
    c.drawCentredString(W / 2, H * 0.48, cfg['manual'])
    c.setFillColorRGB(*BLUE)
    c.setFont('DV-Bold', 13)
    c.drawCentredString(W / 2, H * 0.415, 'Printly v0.2.8.3 · REV6')
    c.setFillColorRGB(*MID)
    c.setFont('DV', 10)
    c.drawCentredString(W / 2, H * 0.355, cfg['lang'])
    c.drawCentredString(W / 2, H * 0.315, 'IcoLabs · Software & AI Studio · icolabsbr@gmail.com')


def draw_text_block(c: canvas.Canvas, lines: list[str], x: float, top: float, width: float, bottom: float, image_page: bool) -> None:
    if not lines:
        return
    # The first content line is normally the section/page heading.
    title = lines[0].strip()
    body = lines[1:]
    c.setFillColorRGB(*NAVY)
    c.setFont('DV-Bold', 15 if image_page else 16)
    if title:
        c.drawString(x, top, title[:115])
        top -= 23

    available = max(40, top - bottom)
    font_size = 8.1 if image_page else 8.6
    leading = font_size * 1.38
    max_chars = 118 if image_page else 132
    wrapped = []
    for line in body:
        wrapped.extend(wrap_line(line, max_chars))
    max_lines = int(available / leading)
    if len(wrapped) > max_lines:
        ratio = max_lines / max(1, len(wrapped))
        font_size = max(6.4, font_size * max(0.78, ratio))
        leading = font_size * 1.32
        max_chars = int(max_chars * (8.4 / font_size))
        wrapped = []
        for line in body:
            wrapped.extend(wrap_line(line, max_chars))
        max_lines = int(available / leading)

    c.setFillColorRGB(0.13, 0.18, 0.23)
    c.setFont('DV', font_size)
    y = top
    for line in wrapped[:max_lines]:
        if not line.strip():
            y -= leading * 0.7
            continue
        if re.match(r'^\s*[•\-]\s*', line):
            c.setFillColorRGB(*BLUE)
            c.circle(x + 2.5, y + 2.2, 1.3, fill=1, stroke=0)
            c.setFillColorRGB(0.13, 0.18, 0.23)
            line = re.sub(r'^\s*[•\-]\s*', '', line)
            c.drawString(x + 10, y, line)
        else:
            c.drawString(x, y, line)
        y -= leading


def build(lang: str, cfg: dict) -> Path:
    text = decode_source(SOURCE / cfg['src'])
    pages = text.split('\f')
    if pages and not pages[-1].strip():
        pages.pop()
    out = DOWNLOADS / cfg['out']
    c = canvas.Canvas(str(out), pagesize=landscape(A4), pageCompression=1)
    c.setTitle(f"{cfg['manual']} - Printly v0.2.8.3 REV6")
    c.setAuthor('IcoLabs')
    c.setSubject('Printly 3D Printing Management')

    for idx, raw in enumerate(pages, start=1):
        lines = clean_page(raw)
        if idx == 1:
            draw_cover(c, cfg, lines)
            header_footer(c, cfg, idx)
            c.showPage()
            continue

        c.setFillColorRGB(1, 1, 1)
        c.rect(0, 0, W, H, fill=1, stroke=0)
        header_footer(c, cfg, idx)
        img_name = PAGE_IMAGES.get(idx)
        img_path = ASSETS / img_name if img_name else None
        has_img = bool(img_path and img_path.exists())
        if has_img:
            # Text above, real Printly screenshot below.
            text_bottom = H * 0.61
            draw_text_block(c, lines, MARGIN_X, TOP, W - 2 * MARGIN_X, text_bottom, True)
            draw_contain_image(c, img_path, MARGIN_X + 14, BOTTOM + 20, W - 2 * MARGIN_X - 28, H * 0.50)
        else:
            draw_text_block(c, lines, MARGIN_X, TOP, W - 2 * MARGIN_X, BOTTOM + 14, False)
        c.showPage()

    c.save()
    print(f'generated {out} ({out.stat().st_size} bytes)')
    return out


for language, settings in CONFIG.items():
    build(language, settings)
