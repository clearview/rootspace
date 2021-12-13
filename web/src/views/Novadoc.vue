<template>
  <div
    class="page"
    ref="page"
  >
    <header
      class="page-header"
      :class="{scrolled: pageScrolled}"
      v-if="!isPublicView"
    >
      <div
        class="editor-toolbar m-0 w-full"
        v-if="!doc"
      >
        <ToolbarGhost active></ToolbarGhost>
      </div>
      <editor-menu-bar
        ref="menuBar"
        :editor="editor"
        v-slot="{ commands, isActive, getMarkAttrs, getNodeAttrs, focused }"
        v-show="doc"
      >
        <div v-if="!isReadonly" class="editor-toolbar">
          <MenuGroup
            big
            value="Normal Text"
            :disabled="!canChangeTextType(isActive, focused)"
            v-tippy="{ placement : 'top',  arrow: true }"
            content="Text Style"
          >
            <template #default>
              <div style="padding-right: 32px;">
                {{ getTextDisplayType(isActive) }}
              </div>
            </template>
            <template #options="{select, hide}">
              <MenuGroupOption
                @click="select('Heading 1');hide();commands.paragraph({level: 1})"
                :active="isActive.paragraph({level: 1})"
              >
                <template #icon>
                  H1
                </template>
                <template #label>
                  Heading 1
                </template>
              </MenuGroupOption>
              <MenuGroupOption
                @click="select('Heading 2');hide();commands.paragraph({level: 2})"
                :active="isActive.paragraph({level: 2})"
              >
                <template #icon>
                  H2
                </template>
                <template #label>
                  Heading 2
                </template>
              </MenuGroupOption>
              <MenuGroupOption
                @click="select('Heading 3');hide();commands.paragraph({level: 3})"
                :active="isActive.paragraph({level: 3})"
              >
                <template #icon>
                  H3
                </template>
                <template #label>
                  Heading 3
                </template>
              </MenuGroupOption>
              <MenuGroupOption
                @click="select('Normal Text');hide();commands.paragraph({level: 0})"
                :active="isActive.paragraph({level: 0})"
              >
                <template #icon>
                  Tt
                </template>
                <template #label>
                  Normal Text
                </template>
              </MenuGroupOption>
            </template>
          </MenuGroup>
          <div class="menu-separator"></div>
          <button
            class="menu menu-big"
            :class="{ 'active': isActive.bold() }"
            :disabled="!canBeBold(isActive, focused)"
            @click="commands.bold"
            v-tippy="{ placement : 'top',  arrow: true }"
            content="Bold"
          >
            <legacy-icon
              name="bold"
              viewbox="16"
              size="16"
            ></legacy-icon>
          </button>
          <button
            class="menu menu-big"
            :class="{ 'active': isActive.italic() }"
            :disabled="!canBeItalic(isActive, focused)"
            @click="commands.italic"
            v-tippy="{ placement : 'top',  arrow: true }"
            content="Italic"
          >
            <legacy-icon
              name="italic"
              viewbox="16"
              size="16"
            ></legacy-icon>
          </button>
          <button
            class="menu menu-big"
            :class="{ 'active': isActive.underline() }"
            :disabled="!canBeUnderline(isActive, focused)"
            @click="commands.underline"
            v-tippy="{ placement : 'top',  arrow: true }"
            content="Underline"
          >
            <legacy-icon
              name="underline"
              viewbox="16"
              size="16"
            ></legacy-icon>
          </button>
          <button
            class="menu menu-big"
            :class="{ 'active': isActive.strike() }"
            :disabled="!canBeStrikethrough(isActive, focused)"
            @click="commands.strike"
            v-tippy="{ placement : 'top',  arrow: true }"
            content="Strikethrough"
          >
            <span>
              <legacy-icon
                name="strike"
                viewbox="16"
                size="16"
              ></legacy-icon>
            </span>
          </button>
          <button
            class="menu menu-big"
            :class="{ 'active': isActive.code() }"
            :disabled="!canBeInlineCode(isActive, focused)"
            @click="commands.code"
            v-tippy="{ placement : 'top',  arrow: true }"
            content="Inline Code"
          >
            <TerminalIcon size="16"></TerminalIcon>
          </button>
          <div class="menu-separator"></div>
          <MenuGroup
            big
            value="Left"
            :disabled="!canBeAligned(isActive, focused)"
            v-tippy="{ placement : 'top',  arrow: true }"
            content="Alignment"
            no-margin
          >
            <template #default>
              <component
                :is="getalignmentIcon(getNodeAttrs('paragraph').align)"
                size="14"
                :name="getalignmentIconName(getNodeAttrs('paragraph').align)"
              ></component>
            </template>
            <template #options="{select, hide}">
              <MenuGroupOption @click="select('Left');hide();commands.paragraph({align: 'left'})">
                <template #icon>
                  <legacy-icon
                    name="align-left"
                    viewbox="16"
                    size="16"
                  ></legacy-icon>
                </template>
                <template #label>
                  Left
                </template>
              </MenuGroupOption>
              <MenuGroupOption @click="select('Center');hide();commands.paragraph({align: 'center'})">
                <template #icon>
                  <legacy-icon
                    name="align-center"
                    viewbox="16"
                    size="16"
                  ></legacy-icon>
                </template>
                <template #label>
                  Center
                </template>
              </MenuGroupOption>
              <MenuGroupOption @click="select('Right');hide();commands.paragraph({align: 'right'})">
                <template #icon>
                  <legacy-icon
                    name="align-right"
                    viewbox="16"
                    size="16"
                  ></legacy-icon>
                </template>
                <template #label>
                  Right
                </template>
              </MenuGroupOption>
              <MenuGroupOption @click="select('Justify');hide();commands.paragraph({align: 'justify'})">
                <template #icon>
                  <AlignJustifyIcon size="16"></AlignJustifyIcon>
                </template>
                <template #label>
                  Justify
                </template>
              </MenuGroupOption>
            </template>
          </MenuGroup>
          <div class="menu-separator"></div>
          <MenuGroup
            value="#000"
            :disabled="!canBeBgColored(isActive, focused)"
            :show-arrow="false"
            v-tippy="{ placement : 'top',  arrow: true }"
            content="Text Color"
            :background="getMarkAttrs('text_color').color ===  '#EEEEEE' || getMarkAttrs('text_color').color ===  '#F5F5F5' || getMarkAttrs('text_color').color ===  '#FAFAFA' ? '#333' : ''"
          >
            <template #default>
              <legacy-icon
                name="text-color"
                viewbox="16"
                size="16"
                :style="{ color: getMarkAttrs('text_color').color }"
              ></legacy-icon>
            </template>
            <template #options="{select, hide}">
              <div class="color-blocks text-color-blocks">
                <div
                  v-for="textColor in textColors"
                  :key="textColor.color"
                  class="color-block"
                  :style="{background: textColor.color, border: `solid 1px ${textColor.border}`}"
                  @click="select(textColor.color);hide();commands.text_color({color: textColor.color})"
                >
                  <legacy-icon
                    v-if="textColor.color === getMarkAttrs('text_color').color"
                    name="checkmark3"
                    viewbox="16"
                    size="16"
                    class="check"
                    :style="{color: blackOrWhite(textColor.color)}"
                  ></legacy-icon>
                </div>
              </div>
            </template>
          </MenuGroup>
          <MenuGroup
            big
            value="#000"
            :disabled="!canBeBgColored(isActive, focused)"
            :show-arrow="false"
            v-tippy="{ placement : 'top',  arrow: true }"
            content="Highlight Color"
            :background="getMarkAttrs('bg_color').color ? getMarkAttrs('bg_color').color : ''"
            no-margin
          >
            <template #default>
              <legacy-icon
                name="highlight"
                viewbox="16"
                size="16"
                :style="{background: getMarkAttrs('bg_color').color ? getMarkAttrs('bg_color').color : '', color: getMarkAttrs('bg_color').color ? getMarkAttrs('text_color').color : ''}"
              ></legacy-icon>
            </template>
            <template #options="{select, hide}">
              <div class="color-combo-title">
                select combination
              </div>
              <div
                class="color-combo"
                v-for="combo in colorCombinations"
                :key="combo.background"
                :style="{background: combo.background, color: combo.color}"
                :class="[combo.class, getMarkAttrs('bg_color').color === combo.background ? 'active' : '']"
                @click="select(combo);hide();commands.bg_color({color: combo.background});commands.text_color({color: combo.color})"
              >
                {{combo.name}}
              </div>
            </template>
          </MenuGroup>
          <div class="menu-separator"></div>
          <button
            class="menu menu-big"
            :class="{ 'active': getCurrentActiveNode(2) === 'bullet_list' } "
            :disabled="!canBeConvertedToList(isActive, focused)"
            @click="commands.bullet_list();"
            v-tippy="{ placement : 'top',  arrow: true }"
            content="Bullet List"
          >
            <ListIcon size="16"></ListIcon>
          </button>
          <button
            class="menu menu-big"
            :class="{ 'active': getCurrentActiveNode(2) === 'ordered_list' }"
            :disabled="!canBeConvertedToList(isActive, focused)"
            @click="commands.ordered_list();"
            v-tippy="{ placement : 'top',  arrow: true }"
            content="Numbered List"
          >
            <legacy-icon
              name="ordered-list"
              viewbox="16"
              size="16"
            ></legacy-icon>
          </button>
          <div class="menu-separator"></div>
          <button
            class="menu menu-big"
            :class="{ 'active': getCurrentActiveNode(2) === 'todo_list' }"
            :disabled="!canBeConvertedToList(isActive, focused)"
            @click="commands.todo_list"
            v-tippy="{ placement : 'top',  arrow: true }"
            content="Checklist"
          >
            <CheckSquareIcon size="16"></CheckSquareIcon>
          </button>
          <button
            class="menu menu-big"
            :class="{ 'active': isActive.image() }"
            :disabled="!canInsertImage(isActive, focused)"
            @click="commands.image({docId: id, spaceId: activeSpace.id})"
            v-tippy="{ placement : 'top',  arrow: true }"
            content="Image"
          >
            <ImageIcon size="16"></ImageIcon>
          </button>
          <MenuGroup
            big
            :value="getMarkAttrs('link').href"
            :disabled="!canBeLinked(isActive, focused)"
            :show-arrow="false"
            v-tippy="{ placement : 'top',  arrow: true }"
            content="Link"
          >
            <template #default>
              <legacy-icon
                name="link2"
                viewbox="16"
                size="16"
              ></legacy-icon>
            </template>
            <template #options="{ hide }">
              <NovadocLinkInput
                @cancel="hide()"
                @submit="commands.link({href: $event});hide();"
              ></NovadocLinkInput>
            </template>
          </MenuGroup>
          <button
            class="menu menu-big"
            :class="{ 'active': isActive.reference() }"
            :disabled="!canInsertReference(isActive, focused)"
            @click="insertReference(commands)"
            v-tippy="{ placement : 'top',  arrow: true }"
            content="Reference"
          >
            <legacy-icon
              name="reference-link"
              viewbox="16"
              size="16"
            ></legacy-icon>
          </button>
          <button
            class="menu menu-big"
            :class="{ 'active': isActive.divider() }"
            :disabled="!canInsertLine(isActive, focused)"
            @click="commands.divider"
            v-tippy="{ placement : 'top',  arrow: true }"
            content="Horizontal line"
          >
            <MinusIcon size="16"></MinusIcon>
          </button>
          <button
            class="menu menu-big"
            :class="{ 'active': isActive.blockquote() }"
            :disabled="!canBeConvertedToQuote(isActive, focused)"
            @click="commands.blockquote"
            v-tippy="{ placement : 'top',  arrow: true }"
            content="Blockquote"
          >
            <legacy-icon
              viewbox="16"
              name="quote"
              size="16"
            ></legacy-icon>
          </button>
          <button
            class="menu menu-big no-margin"
            :class="{ 'active': isActive.code_block() }"
            :disabled="!canBeConvertedToCodeBlock(isActive, focused)"
            @click="createCodeBlock(commands.paragraph_merger, commands.code_block)"
            v-tippy="{ placement : 'top',  arrow: true }"
            content="Code block"
          >
            <CodeIcon size="16"></CodeIcon>
          </button>
          <div class="menu-separator"></div>
          <button
            class="menu menu-big no-margin"
            :disabled="!canCreateTable(isActive, focused)"
            @click="commands.createTable({rowsCount: 3, colsCount: 3, withHeaderRow: false })"
            v-tippy="{ placement : 'top',  arrow: true }"
            content="Table"
          >
            <legacy-icon
              name="table"
              viewbox="16"
              size="16"
            ></legacy-icon>
          </button>
          <div class="menu-separator"></div>
          <button
            class="menu menu-big"
            @click="commands.undo"
            v-tippy="{ placement : 'top',  arrow: true }"
            content="Undo"
            :disabled="!canUndo()"
          >
            <legacy-icon
              name="undo"
              viewbox="16"
              size="16"
            ></legacy-icon>
          </button>
          <button
            class="menu menu-big"
            @click="commands.redo"
            v-tippy="{ placement : 'top',  arrow: true }"
            content="Redo"
            :disabled="!canRedo()"
          >
            <legacy-icon
              name="redo"
              viewbox="16"
              size="16"
            ></legacy-icon>
          </button>
        </div>
      </editor-menu-bar>
      <div
        v-if="currentUser"
        class="editor-context-menu"
        v-show="doc"
      >
        <div
          class="lock-indicator"
          v-if="isLocked"
        >
          <legacy-icon name="lock"></legacy-icon>
        </div>
        <Popover
          :z-index="1001"
          :with-close="false"
          position="bottom-start"
          borderless
        >
          <template #default="{ hide }">
            <div
              class="action-line"
              @click="hide();showHistory()"
            >
              <legacy-icon
                name="history"
                viewbox="20"
              ></legacy-icon>
              <div class="action-line-text">
                History
              </div>
            </div>
            <div
              v-if="!isReadonly"
              class="action-line"
              @click="hide();toggleLocked()"
            >
              <legacy-icon name="lock"></legacy-icon>
              <div
                class="action-line-text"
                v-if="isLocked"
              >
                Unlock
              </div>
              <div
                class="action-line-text"
                v-else
              >
                Lock
              </div>
            </div>
            <div v-if="!isReadonly && (isOwner || isAdmin)" class="action-line" @click="hide();share()">
              <mono-icon name="share"></mono-icon>
              <div class="action-line-text">
                Share
              </div>
            </div>
            <div v-if="!isReadonly" class="action-separator"></div>
            <div
              v-if="!isReadonly"
              class="action-line danger"
              @click="hide();archiveNovadoc()"
            >
              <mono-icon class="action-icon" name="archive"/>
              <div class="action-line-text">
                Archive
              </div>
            </div>
          </template>
          <template #trigger="{ visible }">
            <button
              class="menu-btn btn btn-link"
              :class="{'btn-link-primary': visible}"
            >
              <legacy-icon
                name="vertical-ellipsis"
                viewbox="20"
                size="16px"
              />
            </button>
          </template>
        </Popover>
      </div>
    </header>
    <DocGhost
      v-if="!doc"
      active
    ></DocGhost>
    <div
      v-show="doc"
      class="page-editor"
      ref="pageEditor"
    >
      <div
        class="paper"
        @scroll="determineHeaderState"
        ref="paper"
        @mousedown.self="focusToEditor($event, true)"
      >
        <div class="paper-content">
          <editor-menu-bubble
            :editor="editor"
            v-slot="{ isActive, commands, menu, getMarkAttrs }"
            v-if="!isPublicView && !isReadonly"
          >
            <div>
              <div
                class="link-bubble bubble"
                ref="linkBubble"
                v-if="!canShowBubble(isActive, menu) && isActive.link() && !isCellSelection() && !isLocked"
                :style="getBubblePosition()"
                @mousedown.stop.prevent="consume"
              >
                <div class="bubble-wrap">
                  <MenuGroup
                    :value="getMarkAttrs('link').href"
                    :show-arrow="false"
                  >
                    <template #default>
                      <legacy-icon
                        name="link-edit"
                        viewbox="16"
                        size="16"
                        v-tippy="{ placement : 'top',  arrow: true }"
                        content="Edit Link"
                      ></legacy-icon>
                    </template>
                    <template #options="{ hide }">
                      <NovadocLinkInput
                        @cancel="hide()"
                        @submit="commands.link({href: $event});hide();"
                        :value="getMarkAttrs('link').href"
                      ></NovadocLinkInput>
                    </template>
                  </MenuGroup>
                  <NovadocMenuButton
                    @click="commands.link({})"
                    v-tippy="{ placement : 'top',  arrow: true }"
                    content="Unlink"
                    no-margin
                  >
                    <legacy-icon
                      name="unlink"
                      viewbox="16"
                      size="16"
                    ></legacy-icon>
                  </NovadocMenuButton>
                  <NovadocMenuSeparator></NovadocMenuSeparator>
                  <NovadocMenuButton
                    @click="openLink(getMarkAttrs('link').href)"
                    v-tippy="{ placement : 'top',  arrow: true }"
                    :content="getMarkAttrs('link').href"
                  >
                    <legacy-icon
                      name="open-link"
                      viewbox="16"
                      size="16"
                    ></legacy-icon>
                  </NovadocMenuButton>
                </div>
              </div>
              <div
                class="bubble"
                ref="bubble"
                :style="getBubblePosition()"
                @mousedown.stop.prevent="consume"
              >
                <div
                  class="bubble-wrap"
                  v-if="canShowBubble(isActive, menu)"
                >
                  <button
                    class="menu"
                    :class="{ 'active': isActive.bold() }"
                    v-if="canBeBold(isActive, true)"
                    @click="commands.bold"
                    v-tippy="{ placement : 'top',  arrow: true }"
                    content="Bold"
                  >
                    <legacy-icon
                      name="bold"
                      viewbox="16"
                      size="16"
                    ></legacy-icon>
                  </button>
                  <button
                    class="menu"
                    :class="{ 'active': isActive.italic() }"
                    v-if="canBeItalic(isActive, true)"
                    @click="commands.italic"
                    v-tippy="{ placement : 'top',  arrow: true }"
                    content="Italic"
                  >
                    <legacy-icon
                      name="italic"
                      viewbox="16"
                      size="16"
                    ></legacy-icon>
                  </button>
                  <button
                    class="menu"
                    :class="{ 'active': isActive.underline() }"
                    v-if="canBeUnderline(isActive, true)"
                    @click="commands.underline"
                    v-tippy="{ placement : 'top',  arrow: true }"
                    content="Underline"
                  >
                    <legacy-icon
                      name="underline"
                      viewbox="16"
                      size="16"
                    ></legacy-icon>
                  </button>
                  <button
                    class="menu"
                    :class="{ 'active': isActive.strike() }"
                    v-if="canBeStrikethrough(isActive, true)"
                    @click="commands.strike"
                    v-tippy="{ placement : 'top',  arrow: true }"
                    content="Strikethrough"
                  >
                    <span>
                      <legacy-icon
                        name="strike"
                        viewbox="16"
                        size="16"
                      ></legacy-icon>
                    </span>
                  </button>
                  <button
                    class="menu"
                    :class="{ 'active': isActive.code() }"
                    v-if="canBeInlineCode(isActive, true)"
                    @click="commands.code"
                    v-tippy="{ placement : 'top',  arrow: true }"
                    content="Inline Code"
                  >
                    <TerminalIcon size="16"></TerminalIcon>
                  </button>
                  <MenuGroup
                    value="#000"
                    v-if="canBeTextColored(isActive, true)"
                    :show-arrow="false"
                    v-tippy="{ placement : 'top',  arrow: true }"
                    content="Text Color"
                    :background="getMarkAttrs('text_color').color ===  '#EEEEEE' || getMarkAttrs('text_color').color ===  '#F5F5F5' || getMarkAttrs('text_color').color ===  '#FAFAFA' ? '#333' : ''"
                  >
                    <template #default>
                      <legacy-icon
                        name="text-color"
                        viewbox="16"
                        size="16"
                        :style="{ color: getMarkAttrs('text_color').color }"
                      ></legacy-icon>
                    </template>
                    <template #options="{select, hide}">
                      <div class="color-blocks text-color-blocks">
                        <div
                          v-for="textColor in textColors"
                          :key="textColor.color"
                          class="color-block"
                          :style="{background: textColor.color, border: `solid 1px ${textColor.border}`}"
                          @click="select(textColor.color);hide();commands.text_color({color: textColor.color});hideBubble()"
                        >
                          <legacy-icon
                            v-if="textColor.color === getMarkAttrs('text_color').color"
                            name="checkmark3"
                            viewbox="16"
                            size="16"
                            class="check"
                            :style="{color: blackOrWhite(textColor.color)}"
                          ></legacy-icon>
                        </div>
                      </div>
                    </template>
                  </MenuGroup>
                  <MenuGroup
                    value="#000"
                    v-if="canBeBgColored(isActive, true)"
                    :show-arrow="false"
                    v-tippy="{ placement : 'top',  arrow: true }"
                    content="Highlight Color"
                    :background="getMarkAttrs('bg_color').color ? getMarkAttrs('bg_color').color : ''"
                    no-margin
                  >
                    <template #default>
                      <legacy-icon
                        name="highlight"
                        viewbox="16"
                        size="16"
                        :style="{background: getMarkAttrs('bg_color').color ? getMarkAttrs('bg_color').color : '', color: getMarkAttrs('bg_color').color ? getMarkAttrs('text_color').color : ''}"
                      ></legacy-icon>
                    </template>
                    <template #options="{select, hide}">
                      <div class="color-combo-title">
                        select combination
                      </div>
                      <div
                        class="color-combo"
                        v-for="combo in colorCombinations"
                        :key="combo.background"
                        :style="{background: combo.background, color: combo.color}"
                        :class="[combo.class, getMarkAttrs('bg_color').color === combo.background ? 'active' : '']"
                        @click="select(combo);hide();commands.bg_color({color: combo.background});commands.text_color({color: combo.color});hideBubble()"
                      >
                        {{combo.name}}
                      </div>
                    </template>
                  </MenuGroup>
                  <NovadocMenuSeparator v-if="canBeLinked(isActive, true)"></NovadocMenuSeparator>
                  <MenuGroup
                    :value="getMarkAttrs('link').href"
                    :show-arrow="false"
                    v-tippy="{ placement : 'top',  arrow: true }"
                    content="Link"
                    v-if="canBeLinked(isActive, true)"
                  >
                    <template #default>
                      <legacy-icon
                        name="edit2"
                        viewbox="16"
                        size="12"
                        v-if="isActive.link()"
                      ></legacy-icon>
                      <legacy-icon
                        v-else
                        name="link2"
                        viewbox="16"
                        size="16"
                      ></legacy-icon>
                    </template>
                    <template #options="{ hide }">
                      <NovadocLinkInput
                        @cancel="hide()"
                        @submit="commands.link({href: $event});hide();"
                        :value="getMarkAttrs('link').href"
                      ></NovadocLinkInput>
                    </template>
                  </MenuGroup>
                  <NovadocMenuButton
                    @click="commands.link({})"
                    v-if="isActive.link()"
                    v-tippy="{ placement : 'top',  arrow: true }"
                    content="Unlink"
                    no-margin
                  >
                    <legacy-icon
                      name="unlink"
                      viewbox="16"
                      size="16"
                    ></legacy-icon>
                  </NovadocMenuButton>
                  <NovadocMenuSeparator v-if="getMarkAttrs('link').href"></NovadocMenuSeparator>
                  <NovadocMenuButton
                    @click="openLink(getMarkAttrs('link').href)"
                    v-if="isActive.link()"
                    v-tippy="{ placement : 'top',  arrow: true }"
                    :content="getMarkAttrs('link').href"
                  >
                    <legacy-icon
                      name="open-link"
                      viewbox="16"
                      size="16"
                    ></legacy-icon>
                  </NovadocMenuButton>
                </div>
              </div>
            </div>
          </editor-menu-bubble>
          <textarea
            title="Title"
            ref="title"
            class="editor-title-input"
            placeholder="Untitled"
            v-model="title"
            @focus="isTitleFocused = true"
            @blur="isTitleFocused = false"
            @keyup="debouncedSaveTitleOnly"
            @keypress.enter="handleTitleEnter"
            :readonly="isReadonly"
          ></textarea>
          <hr class="title-separator">
          <EditorContent
            key="editor"
            v-show="!isPreviewing"
            :editor="editor"
            @mousedown.native="isMouseDown = true"
          ></EditorContent>
          <EditorContent
            key="preview"
            v-show="isPreviewing"
            class="preview"
            :editor="previewEditor"
          ></EditorContent>
        </div>
      </div>
      <div
        class="page-history"
        v-if="isHistoryVisible"
        @mousedown.stop.prevent="consume"
      >
        <DocHistory
          ref="docHistory"
          :doc="doc"
          :preview="preview"
          :id="id"
          :isReadonly="isReadonly"
          @close="closeHistory"
          @preview="showPreview"
          @restore="restore"
        ></DocHistory>
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import {
  undoDepth,
  redoDepth
} from 'prosemirror-history'
import api from '../utils/api'
import Popover from '@/components/Popover'
import { Editor, EditorContent, EditorMenuBar, EditorMenuBubble, TextSelection } from 'tiptap'
import {
  Blockquote,
  Bold,
  BulletList,
  Code,
  CodeBlockHighlight,
  HardBreak,
  History,
  Italic,
  Link,
  ListItem,
  OrderedList,
  Placeholder,
  Strike,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  TodoItem,
  TodoList,
  TrailingNode,
  Underline
} from 'tiptap-extensions'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import bash from 'highlight.js/lib/languages/bash'
import ButtonSwitch from '@/components/ButtonSwitch'

import * as encoding from 'lib0/encoding.js'
import * as decoding from 'lib0/decoding.js'
import { WebsocketProvider } from 'y-websocket'
import * as Y from 'yjs'

import CollaborationExtension from './Novadoc/CollaborationExtension'
import Novaschema from '@/views/Novadoc/Novaschema.js'

import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  CheckIcon,
  CheckSquareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CodeIcon,
  ColumnsIcon,
  ImageIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  MessageCircleIcon,
  MinusIcon,
  TerminalIcon,
  TrashIcon,
  UnderlineIcon,
  XIcon
} from 'vue-feather-icons'
import DocumentService from '@/services/document'
import SpaceMixin from '@/mixins/SpaceMixin'
import PageMixin from '@/mixins/PageMixin'
import Divider from '@/views/Novadoc/Divider'
import Paragraph from '@/views/Novadoc/Paragraph'
import TableMenu from '@/views/Novadoc/TableMenu'
import MenuGroup from '@/views/Novadoc/MenuGroup'
import MenuGroupOption from '@/views/Novadoc/MenuGroupOption'
import Image from '@/views/Novadoc/Image'
import Reference from '@/views/Novadoc/Reference/Reference'
import TextColor from '@/views/Novadoc/TextColor'
import BgColor from '@/views/Novadoc/BgColor'
import DocHistory from '@/views/Document/DocHistory'
import NovadocLinkInput from '@/views/Novadoc/Menu/NovadocLinkInput'
import NovadocMenuButton from '@/views/Novadoc/Menu/NovadocMenuButton'
import NovadocMenuSeparator from '@/views/Novadoc/Menu/NovadocMenuSeparator'
import ParagraphMerger from '@/views/Novadoc/ParagraphMerger'
import DocGhost from '@/components/DocGhost'
import ToolbarGhost from '@/components/ToolbarGhost'
import { blackOrWhite, hexToHsl } from '@/utils/colors'
import ListMerger from '@/views/Novadoc/ListMerger'
import TabEater from '@/views/Novadoc/TabEater'
import { DocsShareModal } from '@/components/modal'

const wsMessageType = {
  authenticate: 10,
  unauthenticated: 11,
  unauthorized: 12,
  wait: 13,
  initCollaboration: 14,
  restore: 15
}
export default {
  mixins: [SpaceMixin, PageMixin],
  components: {
    ToolbarGhost,
    DocGhost,
    NovadocMenuSeparator,
    NovadocMenuButton,
    NovadocLinkInput,
    DocHistory,
    MenuGroupOption,
    MenuGroup,
    EditorContent,
    ButtonSwitch,
    EditorMenuBar,
    EditorMenuBubble,
    ChevronLeftIcon,
    ChevronRightIcon,
    BoldIcon,
    ColumnsIcon,
    ItalicIcon,
    LinkIcon,
    UnderlineIcon,
    CodeIcon,
    CheckSquareIcon,
    ListIcon,
    TrashIcon,
    AlignLeftIcon,
    AlignRightIcon,
    AlignCenterIcon,
    AlignJustifyIcon,
    MessageCircleIcon,
    XIcon,
    MinusIcon,
    CheckIcon,
    TerminalIcon,
    ImageIcon,
    Popover
  },
  inject: ['modal'],
  data () {
    const debouncedSaveTitleOnly = debounce(() => {
      this.saveTitleOnly(this.title)
    }, 1000)
    return {
      lengthChecked: false,
      provider: null,
      editor: null,
      previewEditor: null,
      doc: null,
      preview: null,
      linkMarking: {
        active: false,
        href: null
      },
      title: '',
      isLocked: false,
      isHistoryVisible: false,
      debouncedSaveTitleOnly: debouncedSaveTitleOnly,
      pageScrolled: false,
      isBubbleFocused: false,
      isTitleFocused: false,
      nodeNameChangesListener: null,
      isMouseDown: false,
      isPreviewing: false,
      contentAccess: {},
      permissions: [],
      userColor: null
    }
  },
  beforeDestroy () {
    this.destroyProvider()
    this.destroyEditor()
  },
  async mounted () {
    this.listenForNodeNameChanges()
    this.listenForDocumentMouseUp()
  },
  destroyed () {
    if (this.nodeNameChangesListener) {
      this.nodeNameChangesListener()
    }
    document.removeEventListener('mouseup', this.releaseMouseDown)
  },
  methods:
  {
    hideBubble () {
      const sel = this.editor.view.state.selection
      const tr = this.editor.view.state.tr
      this.editor.view.dispatch(tr.setSelection(TextSelection.create(tr.doc, sel.to)))
    },
    blackOrWhite (color) {
      return blackOrWhite(hexToHsl(color))
    },
    createCodeBlock (merger, coder) {
      merger({ command: coder })
    },
    consume () {
      // NOTE: Any event that want to be consumed without action should be put here
    },
    canUndo () {
      return undoDepth(this.editor.state) > 1
    },
    canRedo () {
      return redoDepth(this.editor.state) > 0
    },
    destroyProvider () {
      if (this.provider) {
        this.provider.destroy()
      }
    },
    destroyEditor () {
      if (this.editor) {
        this.editor.destroy()
      }
      if (this.previewEditor) {
        this.previewEditor.destroy()
      }
    },
    initProvider () {
      const wsProviderUrl = process.env.VUE_APP_YWS_URL

      if (!wsProviderUrl) {
        throw new Error('process.env.VUE_APP_YWS_URL is missing')
      }

      this.provider = new WebsocketProvider(wsProviderUrl, 'doc_' + this.id, this.ydoc)
      this.provider.awareness.setLocalStateField('user', {
        color: this.getUserColor(),
        name: this.currentUser?.firstName
      })

      const wsAuthenticate = () => {
        const encoder = encoding.createEncoder()
        encoding.writeVarUint(encoder, wsMessageType.authenticate)
        encoding.writeVarString(encoder, this.$store.state.auth.token)
        this.provider.ws.send(encoding.toUint8Array(encoder))
      }

      const onConnecting = () => {
        const providerOnMessage = this.provider.ws.onmessage
        const providerOnOpen = this.provider.ws.onopen

        this.provider.ws.onmessage = event => {
          const decoder = decoding.createDecoder(new Uint8Array(event.data))
          const messageType = decoding.readVarUint(decoder)

          switch (messageType) {
            case wsMessageType.unauthenticated:
              // notify user
              break
            case wsMessageType.unauthorized:
              // notify user
              break
            case 'wait':
              // wait next message
              break
            case wsMessageType.initCollaboration:
              this.provider.ws.onmessage = event => {
                const decoder = decoding.createDecoder(new Uint8Array(event.data))
                const messageType = decoding.readVarUint(decoder)

                if (messageType === wsMessageType.restore) {
                  // notify user
                  this.closeHistory()
                  this.initEditor()
                  return
                }

                // skip our custom messages, don't pass them to yjs to handle
                if (messageType >= 10) {
                  return
                }

                providerOnMessage(event)
              }
              providerOnOpen()
              break
            default:
              break
          }
        }

        this.provider.ws.onopen = () => {
          wsAuthenticate()
        }
      }

      this.provider.on('status', ({ status }) => {
        if (status === 'connecting') {
          onConnecting()
        }
      })

      onConnecting()
    },
    initEditor () {
      this.destroyProvider()
      this.destroyEditor()
      this.doBindState = true

      this.ydoc = this.ydoc = new Y.Doc()
      this.initProvider()

      this.editor = new Editor({
        editable: this.isEditable,
        extensions: [
          new Novaschema(),
          new ParagraphMerger(),
          new Reference('#', this.fetchReferences),
          new Divider(),
          new Paragraph(),
          new TextColor(),
          new BgColor(),
          new Bold(),
          new Blockquote(),
          new CodeBlockHighlight({
            languages: {
              javascript,
              typescript,
              bash,
              xml
            }
          }),
          new HardBreak(),
          new Italic(),
          new Underline(),
          new Strike(),
          new Code(),
          new History(),
          new BulletList(),
          new ListItem(),
          new OrderedList(),
          new TodoList(),
          new TodoItem({
            nested: true
          }),
          new ListMerger(),
          new Image(),
          new Link({
            openOnClick: false,
            target: '_blank'
          }),
          new TrailingNode({
            node: 'paragraph',
            notAfter: ['paragraph']
          }),
          new Placeholder({
            emptyEditorClass: 'is-editor-empty',
            emptyNodeClass: 'is-empty',
            emptyNodeText: () => {
              if ((this.editor && this.editor.state.doc.content && this.editor.state.doc.content.content.length > 1) || this.isReadonly) {
                return ''
              }
              return 'Write something…'
            },
            showOnlyWhenEditable: false,
            showOnlyCurrent: false
          }),
          new Table({
            resizable: true
          }),
          new TableHeader(),
          new TableCell(),
          new TableRow(),
          new TableMenu(),
          new CollaborationExtension(this.provider, this.ydoc.getXmlFragment('prosemirror')),
          new TabEater()
        ],
        emptyDocument: {
          type: 'doc',
          content: []
        }
      })
      this.initPreviewEditor()
    },
    initPreviewEditor () {
      this.previewEditor = new Editor({
        editable: false,
        extensions: [
          new Novaschema(),
          new ParagraphMerger(),
          new Reference('#', this.fetchReferences),
          new Divider(),
          new Paragraph(),
          new TextColor(),
          new BgColor(),
          new Bold(),
          new Blockquote(),
          new CodeBlockHighlight({
            languages: {
              javascript,
              typescript,
              bash,
              xml
            }
          }),
          new HardBreak(),
          new Italic(),
          new Underline(),
          new Strike(),
          new Code(),
          new History(),
          new BulletList(),
          new ListItem(),
          new OrderedList(),
          new Image(),
          new TodoList(),
          new TodoItem({
            nested: true
          }),
          new Link({
            openOnClick: false
          }),
          new Table({
            resizable: true
          }),
          new TableHeader(),
          new TableCell(),
          new TableRow(),
          new TableMenu()
        ],
        emptyDocument: {
          type: 'doc',
          content: []
        }
      })
    },
    getCurrentActiveNode (depth = 1) {
      const sel = this.editor.state.selection
      if (sel) {
        const node = sel.$from.node(sel.$from.depth - depth)
        if (node) {
          return node.type.name
        }
      }
    },
    listenForNodeNameChanges () {
      this.nodeNameChangesListener = this.$store.subscribe(async (mutation) => {
        if (mutation.type === 'tree/setList') {
          const referencedNode = mutation.payload.find(
            node => node.type === 'doc' && node.contentId.toString() === this.id.toString()
          )
          if (referencedNode) {
            if (referencedNode.title.charCodeAt(0) === 1 && referencedNode.title.charCodeAt(1) === 2) {
              this.title = ''
            } else {
              this.title = referencedNode.title
            }
          }
        }
      })
    },
    getBubblePosition () {
      const sel = this.editor.state.selection
      const coords = this.editor.view.coordsAtPos(sel.$from.pos)
      const offsetTop = 36
      if (this.$refs.pageEditor) {
        const left = coords.left - this.$refs.pageEditor.offsetLeft - this.$refs.pageEditor.offsetParent.offsetLeft
        return {
          left: left + 'px',
          top: coords.top - offsetTop - this.$refs.pageEditor.offsetTop + this.$refs.paper.scrollTop + 'px'
        }
      }
      return {
        left: '0',
        top: coords.top - offsetTop + 'px'
      }
    },
    focusBubble () {
      this.isBubbleFocused = true
    },
    canEdit () {
      return true
    },
    canInsertImage (isActive, focused) {
      if (isActive.paragraph({ level: 0 }) && focused && !this.isLocked) {
        return true
      }
    },
    insertReference (commands) {
      commands.showReference()
    },
    canInsertReference (isActive, focused) {
      if (isActive.paragraph({ level: 0 }) && focused && !this.isLocked) {
        return true
      }
    },
    canInsertLine (isActive, focused) {
      if (isActive.paragraph({ level: 0 }) && focused && !this.isLocked) {
        return true
      }
    },
    canBeLinked (isActive, focused) {
      if (isActive.paragraph({ level: 0 }) && focused && !this.isLocked) {
        return true
      }
    },
    canBeBold (isActive, focused) {
      if (isActive.paragraph({ level: 0 }) && focused && !this.isLocked) {
        return true
      }
      if (this.isCellSelection() && focused && !this.isLocked) {
        return true
      }
    },
    canBeItalic (isActive, focused) {
      if (isActive.paragraph({ level: 0 }) && focused && !this.isLocked) {
        return true
      }
      if (this.isCellSelection() && focused && !this.isLocked) {
        return true
      }
    },
    canBeUnderline (isActive, focused) {
      if (isActive.paragraph({ level: 0 }) && focused && !this.isLocked) {
        return true
      }
      if (this.isCellSelection() && focused && !this.isLocked) {
        return true
      }
    },
    canBeStrikethrough (isActive, focused) {
      if (isActive.paragraph({ level: 0 }) && focused && !this.isLocked) {
        return true
      }
      if (this.isCellSelection() && focused && !this.isLocked) {
        return true
      }
    },
    canBeInlineCode (isActive, focused) {
      if (isActive.paragraph({ level: 0 }) && focused && !this.isLocked) {
        return true
      }
    },
    canBeAligned (isActive, focused) {
      if (isActive.paragraph() && focused && !this.isLocked) {
        return true
      }
    },
    canBeTextColored (isActive, focused) {
      if (isActive.paragraph() && focused && !this.isLocked) {
        return true
      }
      if (this.isCellSelection() && focused && !this.isLocked) {
        return true
      }
    },
    canBeBgColored (isActive, focused) {
      if (isActive.paragraph() && focused && !this.isLocked) {
        return true
      }
      if (this.isCellSelection() && focused && !this.isLocked) {
        return true
      }
    },
    canBeConvertedToList (isActive, focused) {
      if ((isActive.paragraph({ level: 0 }) || isActive.bullet_list() || isActive.ordered_list() || isActive.todo_list()) && focused && !this.isLocked) {
        return true
      }
    },
    canBeConvertedToQuote (isActive, focused) {
      if (isActive.paragraph({ level: 0 }) && focused && !this.isLocked) {
        return true
      }
    },
    canBeConvertedToCodeBlock (isActive, focused) {
      if ((isActive.paragraph({ level: 0 }) || isActive.code_block()) && focused && !this.isLocked) {
        return true
      }
    },
    canChangeTextType (isActive, focused) {
      if (isActive.paragraph() && !isActive.bullet_list() && !isActive.ordered_list() && !isActive.todo_list() && focused && !this.isLocked) {
        return true
      }
    },
    canCreateTable (isActive, focused) {
      if (isActive.paragraph({ level: 0 }) && focused && !this.isLocked && !isActive.table()) {
        return true
      }
    },
    isCellSelection () {
      if (this.editor && this.editor.state.selection.$anchorCell && this.editor.state.selection.$headCell) {
        return true
      }
    },
    async fetchUsers () {
      if (!this.currentUser) {
        return
      }

      return (await api.get('spaces/' + this.activeSpace.id + '/users')).data.data
    },
    async fetchReferences () {
      if (!this.currentUser) {
        return
      }

      return (await api.get('spaces/' + this.activeSpace.id + '/tree')).data.data
    },
    getTextDisplayType (isActive) {
      if (isActive.paragraph({ level: 0 })) {
        return 'Text'
      }
      if (isActive.paragraph({ level: 1 })) {
        return 'Heading 1'
      }
      if (isActive.paragraph({ level: 2 })) {
        return 'Heading 2'
      }
      if (isActive.paragraph({ level: 3 })) {
        return 'Heading 3'
      }
      return 'Text'
    },
    getalignmentType (align) {
      switch (align) {
        case 'left':
          return 'Left'
        case 'center':
          return 'Center'
        case 'right':
          return 'Right'
        case 'justify':
          return 'Justify'
      }
      return 'Left'
    },
    getalignmentIcon (align) {
      switch (align) {
        case 'left':
          return AlignLeftIcon
        case 'center':
          return AlignCenterIcon
        case 'right':
          return AlignRightIcon
        case 'justify':
          return AlignJustifyIcon
      }
      return AlignLeftIcon
    },
    getalignmentIconName (align) {
      switch (align) {
        case 'left':
          return 'align-left'
        case 'center':
          return 'align-center'
        case 'right':
          return 'align-right'
        case 'justify':
          return null
      }
      return 'align-left'
    },
    getListTypeIcon (isActive) {
      if (isActive.todo_list()) {
        return CheckSquareIcon
      }
      return ListIcon
    },
    showLinkForm (attr) {
      this.linkMarking.active = true
      this.linkMarking.href = attr.href
      this.$nextTick(() => {
        if (this.$refs.linkInput) {
          this.$refs.linkInput.focus()
        }
      })
    },
    focusToEditor ($evt, force = false) {
      if (this.editor) {
        if (this.title.trim().length === 0) {
          this.$refs.title.focus()
        } else if (!this.editor.state.selection.empty && this.editor.state.selection.to !== this.editor.state.selection.from && !force) {
          this.editor.focus()
        } else if (this.editor.state.doc.content.firstChild.content.size === 0) {
          this.editor.focus(1)
        } else {
          this.editor.focus(this.editor.state.doc.content.size - 1)
        }
      }
    },
    hideLinkForm () {
      this.linkMarking.active = false
      this.linkMarking.href = null
    },
    setLinkData (command, href) {
      command({ href })
      this.hideLinkForm()
    },
    visitLink (attr) {
      window.open(attr.href, '_blank')
    },
    async load () {
      if (this.isPublicView) {
        this.loadPublicDocument()
      } else {
        this.loadEditableDocument()
      }
    },
    async loadPublicDocument () {
      const { id } = this.$route.params
      const res = await DocumentService.view(id)
      this.doc = res.data

      this.contentAccess = res.contentAccess
      this.permissions = res.permissions
      this.pageTitle = res.data.title
      this.title = res.data.title.trim()
      this.initPreviewEditor()
      this.isPreviewing = true
      this.previewEditor.setContent(res.data.content)
    },
    getRandomHexColor () {
      const colors = [
        '#1d955b',
        '#cc0000',
        '#e67e00',
        '#12b6ed',
        '#ac49d0',
        '#d5a410',
        '#c12282',
        '#5c6170'
      ]
      const index = Math.floor(Math.random() * 8)
      return colors[index]
    },
    getUserColor () {
      if (this.userColor) return this.userColor
      this.userColor = this.getRandomHexColor()
      return this.userColor
    },
    async loadEditableDocument () {
      const { id } = this.$route.params

      if (this.provider) {
        this.provider.awareness.setLocalStateField('user', {
          color: this.getUserColor(),
          name: this.currentUser?.firstName
        })
      }
      const res = await DocumentService.view(id)
      this.doc = res.data
      this.contentAccess = res.contentAccess
      this.permissions = res.permissions
      this.pageTitle = res.data.title
      this.title = res.data.title.trim()
      this.isLocked = res.data.isLocked
      this.setSlug(res.data.slug)
      // Phantom emptiness detected
      if (this.title.charCodeAt(0) === 1 && this.title.charCodeAt(1) === 2) {
        this.pageTitle = 'Untitled'
        this.title = ''
        this.$refs.title.focus()
      }
      if (!this.pageReady && this.currentUser) {
        await this.activateSpace(res.data.spaceId)
      }
      this.autoResizeTitle()

      if (this.title.trim().length === 0) {
        this.$nextTick(() => {
          this.$refs.title.focus()
        })
      }

      this.initEditor()
    },
    autoResizeTitle () {
      this.$nextTick(() => {
        this.$refs.title.style.height = '1px'
        const height = this.$refs.title.scrollHeight
        if (height === 0) {
          this.$refs.title.style.height = '29px'
        } else {
          this.$refs.title.style.height = height + 'px'
        }
      })
    },
    async saveTitleOnly () {
      const title = this.title
      this.pageTitle = this.title
      const payload = {
        title: title && title.trim().length > 0 ? title : String.fromCharCode(1, 2)
      }
      await this.createUpdateDocument(payload)
    },
    async createUpdateDocument (data) {
      try {
        const id = this.$route.params.id
        this.loading = true

        if (id) {
          const res = await DocumentService.update(id, data)
          this.doc = res.data.data
          this.setSlug(res.data.data.slug)
          if (data.title) {
            this.$store.commit('tree/updateNode', {
              compareFn (node) {
                return node.contentId.toString() === id
              },
              fn (node) {
                return {
                  ...node,
                  title: data.title
                }
              }
            })
          }
        }
        this.loading = false
      } catch (err) {
        this.loading = false
      }
    },
    async toggleLocked () {
      this.isLocked = !this.isLocked
      this.isHistoryVisible = false
      await this.createUpdateDocument({
        isLocked: this.isLocked
      })
      if (this.isLocked) {
        this.showPreview(null)
      } else {
        this.closeHistory()
      }
    },
    share () {
      this.modal.open({
        component: DocsShareModal,
        attrs: {
          id: this.id,
          publicId: this.doc.publicId,
          contentAccess: this.contentAccess,
          onChangeContentAccess: (contentAccess) => {
            this.contentAccess = {
              ...this.contentAccess,
              ...contentAccess
            }
          }
        }
      })
    },

    showHistory () {
      this.preview = null
      this.isHistoryVisible = true
    },
    archiveNovadoc () {
      window.app.confirm('Archive Item', `Are you sure you want to archive ${this.title ? this.title : 'Untitled'} ?`, async () => {
        try {
          await api.post(`docs/${this.doc.id}/archive`)
          this.$router.push({ name: 'Main' })
        } catch (err) {
          this.$toast.error('Oops! something went wrong')
        }
      })
    },
    restore (revision) {
      const encoder = encoding.createEncoder()
      encoding.writeVarUint(encoder, wsMessageType.restore)
      encoding.writeVarUint(encoder, revision.id)

      this.provider.ws.send(encoding.toUint8Array(encoder))
    },
    showPreview (revision) {
      this.isPreviewing = true
      if (!revision) {
        this.preview = {
          id: null,
          content: this.editor.getJSON()
        }
      } else {
        this.preview = revision
      }

      this.previewEditor.setContent(this.preview.content)
    },
    closeHistory () {
      if (this.editor) {
        this.isHistoryVisible = false
        this.isPreviewing = false
        this.editor.setOptions({
          editable: this.isEditable
        })
      }
    },
    handleTitleEnter (evt) {
      evt.preventDefault()
      this.editor.focus()
    },
    determineHeaderState (evt) {
      if (evt.target.scrollTop > 96) {
        this.pageScrolled = true
      } else {
        this.pageScrolled = false
      }
    },
    canShowBubble (isActive, menu) {
      return !this.isLocked && menu.isActive && !this.isTitleFocused && !isActive.code_block() && !isActive.image() &&
        !isActive.table() && !isActive.divider() && !this.isMouseDown
    },
    openLink (url) {
      window.open(url, '_blank')
    },
    listenForDocumentMouseUp () {
      document.addEventListener('mouseup', this.releaseMouseDown)
    },
    releaseMouseDown () {
      this.isMouseDown = false
    },
    setSlug (slug) {
      if (this.$route.params.slug !== slug) {
        this.$router.replace({
          params: {
            slug: slug || 'Untitled'
          }
        }).catch(e => {
          return e
          // Consume redundant error
        })
      }
    }
  },
  watch: {
    id: {
      immediate: true,
      async handler () {
        this.closeHistory()
        await this.load()
        if (this.currentUser && this.activeSpace) {
          await this.$store.dispatch('tree/fetch', { spaceId: this.activeSpace.id })
          if (!this.pageReady) {
            await this.activateSpace(this.activeSpace.id)
          }
        }
        this.pageReady = true
      }
    },
    title (newTitle) {
      this.autoResizeTitle()
      const id = this.id
      this.$store.commit('tree/updateNode', {
        compareFn (node) {
          return node.type === 'doc' && node.contentId.toString() === id.toString()
        },
        fn (node) {
          return {
            ...node,
            title: newTitle
          }
        }
      })
    },
    isLocked: {
      async handler () {
        if (this.editor) {
          this.editor.setOptions({
            editable: this.isEditable
          })
        }
      }
    }
  },
  computed: {
    leftOffset () {
      return this.$refs.page.offsetLeft
    },
    activeSpace () {
      return this.$store.getters['space/activeSpace']
    },
    currentUser () {
      return this.$store.state.auth.user
    },
    id () {
      const { id } = this.$route.params
      return isNaN(id) ? id : Number(id) || 0
    },
    textColors () {
      return [
        { border: 'transparent', color: '#212121' },
        { border: 'transparent', color: '#424242' },
        { border: 'transparent', color: '#616161' },
        { border: 'transparent', color: '#757575' },
        { border: 'transparent', color: '#9E9E9E' },

        { border: 'transparent', color: '#CF3C3C' },
        { border: 'transparent', color: '#B0611A' },
        { border: 'transparent', color: '#9C3DBF' },
        { border: 'transparent', color: '#1D8449' },
        { border: 'transparent', color: '#3467CE' }
      ]
    },
    colors () {
      return [
        '#DED3F8',
        '#F6DDFF',
        '#FFE0E0',
        '#FFEAD2',
        '#DEFFD9',
        '#E0EAFF',
        '#DDF3FF',
        '#65F3E3',
        '#F4F5F7',
        '#FFFFFF'
      ]
    },
    colorCombinations () {
      return [
        {
          border: '#E0E2E7',
          color: '#2C2B35',
          background: '#FFFFFF',
          activeBorder: '#E0E2E7',
          name: 'Default Example',
          class: 'white'
        },
        {
          border: 'transparent',
          color: '#D64141',
          background: '#FFF3F3',
          activeBorder: '#FFB6B6',
          name: 'Red Example',
          class: 'red'
        },
        {
          border: 'transparent',
          color: '#2C2B35',
          background: '#FEFFBA',
          activeBorder: '#E1E26F',
          name: 'Yellow Example',
          class: 'yellow'
        },
        {
          border: 'transparent',
          color: '#2C2B35',
          background: '#FFEBD8',
          activeBorder: '#FFC391',
          name: 'Orange Example',
          class: 'orange'
        },
        {
          border: 'transparent',
          color: '#2C2B35',
          background: '#FFE4F3',
          activeBorder: '#FFC2E4',
          name: 'Pink Example',
          class: 'pink'
        },
        {
          border: 'transparent',
          color: '#2C2B35',
          background: '#E1F8FF',
          activeBorder: '#93D3E7',
          name: 'Blue Example',
          class: 'blue'
        },
        {
          border: 'transparent',
          color: '#2C2B35',
          background: '#E1FFBC',
          activeBorder: '#B8EA7C',
          name: 'Green Example',
          class: 'green'
        }
      ]
    },
    isOwner () {
      return this.contentAccess.ownerId === this.currentUser.id
    },
    isAdmin () {
      return this.activeSpace.role === 0
    },
    isPublicView () {
      return isNaN(this.id)
    },
    isReadonly () {
      const isLoadingPermission = this.permissions.length === 0
      return isLoadingPermission || (this.permissions.length === 1 && this.permissions[0] === 'view')
    },
    isEditable () {
      return !this.isLocked && !this.isReadonly && !this.isPublicView
    }
  }

}
</script>

<style lang="postcss" scoped>

#app > div > .page {
  @apply p-0
}

.color-combo {
  padding: 6px;
  border-radius: 4px;
  border: solid 1px transparent;
  font-weight: bold;
  font-size: 12px;
  line-height: 14px;
  margin: 16px 8px;
  width: 160px;

  &.white {
    border: 1px solid #E0E2E7;
  }
  &:not(.white){
    border: 2px solid transparent;
  }
  &:hover, &.active {
    &.white {
      border: 1px solid #bcbfc8;
    }
    &.red {
      border: 2px solid #FFB6B6;
    }
    &.yellow {
      border: 2px solid #c7c879;
    }
    &.orange {
      border: 2px solid #dbbc9e;
    }
    &.pink {
      border: 2px solid #bc8aa6;
    }
    &.blue {
      border: 2px solid #86b3c1;
    }
    &.green {
      border: 2px solid #b0d287;
    }
  }
}
.page {
  position: relative;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
}

.page-header {
  user-select: none;
  display: flex;
  background: #fff;
  z-index: 1;
  width: 100%;
  border-bottom: solid 1px #E0E2E7;
  padding: 12px 24px;
  box-sizing: border-box;
  align-items: flex-start;
  transition: all 0.15s ease;
  min-height: 57px;

  &.scrolled {
    border-bottom: solid 1px #E0E2E7;
  }

  .editor-toolbar {
    flex: 0 0 auto;
    margin: 0 auto;
    display: flex;
    align-items: center;
    font-size: 12px;
    @media only screen and (max-width: 1300px){
      flex: 1 1 auto;
      flex-wrap: wrap;
    }
  }

  .editor-context-menu {
    flex: 0 0 auto;
    margin-left: auto;
    display: flex;
    align-items: center;
    @media only screen and (max-width: 1300px){

    }

    .lock-indicator {
      border-radius: 4px;
      background: #FFE0E0;
      color: #D64141;
      padding: 8px;
      margin-right: 8px;
    }

    .popover-trigger {
      .menu-btn {
        padding: 8px;
        height: auto;
      }
      &.show {
        .menu-btn {
          color: #146493;
          background: #DDF3FF;
          box-shadow: none;
          .stroke-current {
            color: #146493;
          }
        }
      }
    }
  }

}

.page-history {
  width: 304px;
  height: 100%;
  background: #F8F8FB;
  flex: 0 0 auto;
  display: flex;
}

.page-editor {
  width: 100%;
  position: relative;
  display: flex;
  flex: 1;
  overflow: hidden;
}

.paper {
  width: 100%;
  padding: 40px 0 150px 0;
  overflow-y: auto;
  position: relative;
}

.paper-content {
  @apply px-6 my-auto mx-0
  /* width: 60%; */
  /* margin: 0 auto; */
}

.menu-separator {
  width: 1px;
  height: 24px;
  background: #E0E2E7;
  margin: 0 8px;
  margin-block: auto;
  display: inline-block;
}

.menu {
  background: #fff;
  color: #333;
  border: none;
  padding: 4px;
  outline: none;
  border-radius: 4px;
  transition: all 0.15s ease;
  margin-right: 4px;

  &.no-margin {
    margin-right: 0
  }

  &-big {
    padding: 8px;
  }

  .stroke-current {
    stroke: transparent;
  }

  &:last-child {
    margin-right: 0;
  }

  &:hover {
    background: #F4F5F7;
  }

  &.active, &:active {
    background: #DDF3FF;
    color: #146493;
  }

  &[disabled] {
    opacity: 0.5;
  }
}

.color-blocks {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 8px;
  padding: 24px;
}

.color-block {
  width: 24px;
  height: 24px;
  border-radius: 100%;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  .check {

  }

  &:hover {
    transform: scale(0.9);
  }
}

.bg-color, .text-color {
  box-sizing: border-box;
  font-size: 12px;
}

.bg-color-display, .text-color-display {
  width: 12px;
  height: 12px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-line {
  @apply flex items-center py-2 px-4 my-1;
  min-width: 168px;
  color: theme("colors.gray.900");
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  line-height: 16px;

  &:hover {
    background: #F0F2F5;
  }

  &.danger {
    color: theme("colors.danger.default");
  }
}

.action-line-text {
  @apply ml-2;
  flex: 1 1 auto;
  font-weight: normal;
}

.action-separator {
  @apply my-1;
  height: 1px;
  background: theme("colors.gray.100");
}

.editor-title-input {
  @apply h-full;
  color: #2C2B35;
  font-weight: bold;
  font-size: 36px;
  line-height: 43px;
  outline: none;
  border: none;
  margin-bottom: 24px;
  display: block;
  width: 100%;
  resize: none;
}

.bubble {
  position: absolute;
  z-index: 5;
  .bubble-wrap {
    background: #FFFFFF;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.16);
    border-radius: 4px;
    padding: 4px;
    box-sizing: border-box;
    max-width: 100%;
    font-size: 12px;
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    overflow: visible;
  }
}

.title-separator {
  border: 1px solid #EDEFF3;
  margin: 24px 0;
}

.color-combo-title {
  margin: 20px 8px 16px 8px;
  font-weight: bold;
  font-size: 10px;
  line-height: 12px;
  text-transform: uppercase;
  color: #444754;
}
</style>
<style lang="postcss" scoped>
.page-editor *.is-empty:nth-child(1)::before,
.page-editor *.is-empty:nth-child(2)::before {
  content: attr(data-empty-text);
  float: left;
  color: #aaa;
  pointer-events: none;
  height: 0;
}
</style>
