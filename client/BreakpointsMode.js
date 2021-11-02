import {TOGGLE_MODE_EVENT} from 'bpmn-js-token-simulation/lib/util/EventHelper';
import {getBusinessObject,is} from 'bpmn-js/lib/util/ModelUtil';
import {domify} from 'min-dom';

const OFFSET_BOTTOM = 10,
      OFFSET_RIGHT = 15;

export default function BreakpointsMode(eventBus,overlays,simulator) {
    const self = this;
    this._eventBus = eventBus;
    this._overlays = overlays;
    this.overlayIds = {};
    this.simulator = simulator;

    let nodesToExclude = ["bpmn:StartEvent","bpmn:EndEvent","bpmn:Gateway","bpmn:SubProcess"];

    var css = ".breakpoints-order { border: 1px solid black; display:none; border-radius: 100%; min-width: 3vmin; min-height: 3vmin; line-height: 3vmin; text-align: center; font-size: 25px; font-size: medium; user-select: none; padding: 2px; box-sizing: content-box; } .breakpoints-order.order-count { color: #FFFFFF; font-family: 'Arial', sans-serif; background-color: #ff0000; } .breakpoints-order-show {display:block} ",
    head = document.head,
    style = document.createElement('style');

    style.type = 'text/css';

    style.appendChild(document.createTextNode(css));

    head.appendChild(style);


    eventBus.on(TOGGLE_MODE_EVENT, function(context) {
       
        let breakpointNodes = document.getElementsByClassName('breakpoints-order');
        if(context.active){
            self._eventBus.on('element.click',200, self.selectElement);
            self._eventBus.on('element.contextmenu', 200, self.rightSelectElement);
        }
        else{
            self._eventBus.on('element.click',200, self.selectElement);
            self._eventBus.off('element.contextmenu', self.rightSelectElement);
        }

        [...breakpointNodes].forEach((breakpointNode) => {
            if(context.active) breakpointNode.classList.add("breakpoints-order-show");
            else breakpointNode.classList.remove("breakpoints-order-show");
        });

    });

    this.selectElement = (event) => {
        const { element } = event;
        const overlayHistory = self.overlayIds[element.id];

        if(is(element, 'bpmn:FlowNode') && !(nodesToExclude.map(x => is(element,x)).reduce((prev,old) => prev || old)) && overlayHistory === undefined){
            let elementBo = getBusinessObject(element);
            self.addNewOverlay(element,elementBo)
            self.simulator.waitAtElement(element)    
        }
      };

    
    this.rightSelectElement = (event) => {
        event.preventDefault();
        event.stopPropagation();
        
        const { element } = event;
        const overlayHistory = self.overlayIds[element.id];
       
        if (!overlayHistory) return;
        
        const overlayId = overlayHistory.overlayId;
        self._overlays.remove(overlayId);
        delete self.overlayIds[element.id];
        self.simulator.waitAtElement(element,false);

      };

    this.newOverlayBadgeForDocOrder = (element)  => {
        const overlayHtml = domify(`<div class="breakpoints-order breakpoints-order-show order-count" title="BreakPoints Order"></div>`);
        const position = { bottom: OFFSET_BOTTOM, right: OFFSET_RIGHT };
        return self._overlays.add(element, 'docOrder-badge', {
            position: position,
            html: overlayHtml,
            scale: { min: 1 }
          });
      }
    
    this.addNewOverlay = (element, counter) => {
        const overlayId = self.newOverlayBadgeForDocOrder(element, counter);
        self.overlayIds[element.id] = {
            element: element,
            overlayId: overlayId,
            order: '' + counter
        };         

    }
}
  
BreakpointsMode.$inject = [
   'eventBus',
   'overlays',
   'simulator'
 ];