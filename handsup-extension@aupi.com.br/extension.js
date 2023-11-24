/* extension.js */

const GETTEXT_DOMAIN = 'my-indicator-extension';

const { GObject, St } = imports.gi;
const ExtensionUtils = imports.misc.extensionUtils;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

const _ = ExtensionUtils.gettext;

const Indicator = GObject.registerClass(
class Indicator extends PanelMenu.Button {
    _init(extension) {
        super._init(0.0, _('My Shiny Indicator'));

        this._extension = extension;

        this.add_child(new St.Icon({
            icon_name: 'face-smile-symbolic',
            style_class: 'system-status-icon',
        }));

        // Removendo o item de notificação e adicionando as opções de criar e entrar em salas
        let createRoomItem = new PopupMenu.PopupMenuItem(_('Criar Sala'));
        createRoomItem.connect('activate', this._createRoom.bind(this));
        this.menu.addMenuItem(createRoomItem);

        let enterRoomItem = new PopupMenu.PopupMenuItem(_('Entrar em Sala'));
        enterRoomItem.connect('activate', this._enterRoom.bind(this));
        this.menu.addMenuItem(enterRoomItem);
    }

    _createRoom() {
        let roomName = 'Nova Sala'; // Nome da nova sala
        let secretKey = 'ChaveSecreta'; // Chave secreta para a nova sala
        this._extension.createSecretKey(roomName, secretKey);
        Main.notify(_('Sala criada: ') + roomName);
    }

    _enterRoom() {
        let enteredKey = 'ChaveSecreta'; // Chave inserida pelo usuário para entrar na sala
        let roomName = 'Nova Sala'; // Nome da sala em que o usuário quer entrar
        this._extension.enterRoom(roomName, enteredKey);
    }
});

class Extension {
    constructor(uuid) {
        this._uuid = uuid;

        ExtensionUtils.initTranslations(GETTEXT_DOMAIN);

        // Chaves secretas (simulando um armazenamento simples para exemplo)
        this._secretKeys = {
            'Nova Sala': 'ChaveSecreta' // Exemplo de sala e chave pré-definidas
        };
    }

    enable() {
        this._indicator = new Indicator(this);
        Main.panel.addToStatusArea(this._uuid, this._indicator);
    }

    disable() {
        this._indicator.destroy();
        this._indicator = null;
    }

    // Função para criar uma nova chave secreta (sala)
    createSecretKey(roomName, secretKey) {
        this._secretKeys[roomName] = secretKey;
    }

    // Função para entrar em uma sala com uma chave secreta
    enterRoom(roomName, enteredKey) {
        if (this._secretKeys[roomName] === enteredKey) {
            Main.notify(_('Entrou na sala: ') + roomName);
            // Lógica para entrar na sala com a chave secreta correta
        } else {
            Main.notify(_('Chave secreta incorreta para: ') + roomName);
        }
    }
}

function init(meta) {
    return new Extension(meta.uuid);
}
