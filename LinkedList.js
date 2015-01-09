/**
 * Created by adamdill on 1/8/15.
 */
(function(window) {

    /**
     * Constructor
     * @param arr - Optional Array of values to include in the list.
     * @constructor
     */
    var LinkedList = function(arr) {
        var self = this;

        var _head = null;
        var _tail = null;
        var _length = 0;

        /**
         * The number of items in the list.
         * @returns {integer} the number of items in the list
         */
        this.length = function() {
            return _length;
        };

        /**
         * Adds a value to the end of the list.
         * @param value - the value to add to the end of the list.
         * @returns {integer} the length of the list.
         */
        this.push = function(value) {
            var node = new Node(value);

            if(_head === null) {
                _head = _tail = node;
            } else {
                _tail.next = node;
                node.prev = _tail;
                _tail = node;
            }
            _length++;
            return self.length();
        };

        /**
         * Removes the last value from the list.
         * @returns {*} the last value from the list.
         */
        this.pop = function() {
            var returnValue = null;
            if(_tail !== null) {
                var store = _tail;
                returnValue = _tail.value;
                var prev = _tail.prev;
                if(prev !== null) {
                    prev.next = null;
                    _tail = prev;
                } else {
                    _head = _tail = null;
                }
                store.destroy();
                _length--;
            }
            return returnValue;
        };

        /**
         * Removes the first value from the list.
         * @returns {*} the first value from the list
         */
        this.shift = function() {
            var returnValue = null;
            if(_head !== null) {
                var store = _head;
                returnValue = _head.value;
                var next = _head.next;
                if(next !== null) {
                    next.prev = null;
                    _head = next;
                } else {
                    _head = _tail = null;
                }
                store.destroy();
                _length--;
            }
            return returnValue;
        };

        /**
         * Adds a value to the beginning of the list.
         * @param value - the value to add to the beginning of the list.
         * @returns {integer} the length of the list.
         */
        this.unshift = function(value) {
            var node = new Node(value);

            if(_head === null) {
                _head = _tail = node;
            } else {
                _head.prev = node;
                node.next = _head;
                _head = node;
            }
            _length++;
            return self.length();
        };

        /**
         * TODO: inserts will be added when addItemAt works with an empty list.
         *
         * Removes a range of values from the list.
         * @param startIndex - the starting index for the range
         * @param removeCount - the number of values to remove.
         */
        this.splice = function(startIndex, removeCount) {
            var returnValue = [];

            // defaults
            if(removeCount === undefined) {
                removeCount = self.length();
            }

            var endIndex = (startIndex + removeCount) - 1;
            var currentIndex = endIndex;
            if(indexInBounds(startIndex) && indexInBounds(endIndex)) {
                while(currentIndex >= startIndex) {
                    returnValue.unshift( self.removeItemAt(currentIndex) );
                    currentIndex--;
                }
            }

            return returnValue;
        };

        /**
         * TODO: should allow insert on the end of the list, and empty list at index 0
         *
         * Adds a value to a specified index in the list
         * @param index - the index to insert the value
         * @param value - the value
         */
        this.addItemAt = function(index, value) {
            var target = getNodeAt(index);
            if(target !== null) {
                var node = new Node(value);
                if(target === _head) {
                    _head = node;
                }
                node.prev = target.prev;
                node.next = target;
                target.prev = node;
                _length++;
            }
        };

        /**
         * Removes the value at a specified index.
         * @param index - the index of the value to be removed.
         * @returns {*} the value that was removed.
         */
        this.removeItemAt = function(index) {
            var returnValue = null;
            var node = getNodeAt(index);
            if(node !== null) {
                returnValue = node.value;

                if(node.prev !== null) {
                    node.prev.next = node.next;
                }
                if(node.next !== null) {
                    node.next.prev = node.prev;
                }

                if(node === _head) {
                    _head = node.next;
                }
                if(node === _tail) {
                    _tail = node.prev;
                }

                node.destroy();
                _length--;
            }
            return returnValue;
        };

        /**
         * Iterate the list and execute the provided function. The value is Boxed with a property called "value". Manipulating
         * the box.value property will result in a change to the list value.
         * @param f - the function to execute.
         * @param box - BOOLEAN determines if the value should be boxed in an Object. If set to true, use [argument].value to un-box; then changes to the value
         *              will be applied to the lists value.
         */
        this.forEach = function(f, box) {
            if(typeof(f) === "function") {
                var target = _head;
                var index = 0;
                while (target !== null) {
                    // boxing the value
                    if(box) {
                        var obj = {value:target.value};
                        f(obj, index);
                        target.value = obj['value'];
                    } else {
                        f(target.value, index);
                    }
                    index++;
                    target = target.next;
                }
            }
        };

        /**
         * Get the first index of the provided value.
         * @param value - the value to look for in the list.
         * @returns {integer} the index of the value in the list. -1 if not found.
         */
        this.indexOf = function(value) {
            var returnValue = -1;
            var keepOn = true;
            var target = _head;
            var count = 0;
            while(target && keepOn) {
                if(target.value === value) {
                    returnValue = count;
                    keepOn = false;
                }
                target = target.next;
                count++;
            }
            return returnValue;
        };

        /**
         * Returns the value at the specified index.
         * @param index - the index of the value.
         * @returns {*} the value at the index. NULL if out of bounds.
         */
        this.getItemAt = function(index) {
            var node = getNodeAt(index);
            return (node != null) ? node.value : null;
        };

        /**
         * Swap the values of the items at index a and index b.
         * @param a - the first index
         * @param b - the second index
         */
        this.swapItemsAt = function(a, b) {
            if(indexInBounds(a) && indexInBounds(b) && a !== b) {
                var nodeA = getNodeAt(a);
                var nodeB = getNodeAt(b);

                var storeA = nodeA.value;
                nodeA.value = nodeB.value;
                nodeB.value = storeA;
            }
        };

        /**
         * Reverse the order of the list.
         */
        this.reverse = function() {
            if(self.length() > 1) {
                var mid = self.length() / 2;
                var currentIndex = 0;
                while(currentIndex < mid) {
                    self.swapItemsAt(currentIndex, ((self.length() - 1) - currentIndex));
                    currentIndex++;
                }
            }
        };

        /**
         * Returns a deep copy of the list.
         * @returns {LinkedList} - a deep copy of the list.
         */
        this.clone = function() {
            var clone = JSON.parse( JSON.stringify(self.toArray()) );
            return new LinkedList(clone);
        };

        /**
         * Removes all elements from the list.
         * @returns {Array} the list as an Array
         */
        this.clear = function() {
            var returnValue = self.toArray();
            var target = _head;
            while(target !== null) {
                var next = target.next;
                target.destroy();
                target = next;
            }
            _head = _tail = null;
            return returnValue;
        };


        /**
         * Convert the list to an Array.
         * @returns {Array} an Array representation of the list.
         */
        this.toArray = function() {
            var returnValue = [];
            self.forEach(function(value, i) {
                returnValue.push(value);
            });
            return returnValue;
        };

        /**
         * Convert the list to a String.
         * @param separator - OPTIONAL separator to include between values. Defaults to a comma followed by a space.
         * @returns {string} a String representation of the list.
         */
        this.toString = function(separator) {
            var returnValue = "";

            // defaults
            if(separator === undefined) {
                separator = ", ";
            }

            self.forEach(function(value, i) {
                returnValue += value;
                if(i < (self.length() - 1) ) {
                    returnValue += separator;
                }
            });

            return returnValue;
        };

        /**
         * Adds the items from an array to the end of the list.
         * @param arr - the Array to include.
         */
        this.fromArray = function(arr) {
            if(arr && arr.length !== undefined) {
                arr.forEach(function(value) {
                    self.push(value);
                });
            }
        };

        ///
        ///     INTERNAL
        ///
        /**
         * Get the Node at the given index.
         * @param index - the index
         * @returns {Node} the Node at the given index. NULL if not found.
         */
        var getNodeAt = function(index) {
            var returnValue = null;
            if(indexInBounds(index)) {
                var count = 0;
                var target = _head;
                while(count <= index) {
                    returnValue = target;
                    target = target.next;
                    count++;
                }
            }
            return returnValue;
        };

        /**
         * Determine if the provided index is in bounds/range of the list.
         * @param index - the index to check.
         * @returns {boolean} TRUE if the index is in bounds, FALSE otherwise.
         */
        var indexInBounds = function(index) {
            return (index >= 0 && index < _length);
        };

        // attempt to set the Array initial list provided to the constructor
        self.fromArray(arr);
    };

    /**
     * NODE
     * Internal Structure. The structure used to link the values in the list.
     * @param value - OPTIONAL value to initialize the object
     * @constructor
     */
    var Node = function(value) {
        var self = this;

        this.value = value;
        this.prev = null;
        this.next = null;

        /**
         * Clone this Node
         */
        this.clone = function() {
            var node = new Node(value);
            node.next = self.next;
            node.prev = self.prev;
            return node;
        }

        /**
         * Free Memory
         */
        this.destroy = function() {
            self.value = self.prev = self.next = null;
        };
    }

    // attach
    window.LinkedList = LinkedList;
})(window);