/**
 * Global CAS Symbol Scope Manager (PlaygroundScopeManager)
 * Tracks variable & function definitions across Equation Blocks (e.g. a = 5, f(x) = x^2 - 4)
 * and reactively propagates symbol changes to dependent Equation & Graph blocks.
 */

class ScopeManager {
  constructor() {
    this.symbols = new Map();
    this.subscribers = new Set();
  }

  /**
   * Set or update a variable or function definition in the scope.
   */
  setSymbol(name, value, sourceBlockId = null) {
    if (!name || typeof name !== 'string') return;
    const cleanName = name.trim();
    
    this.symbols.set(cleanName, {
      name: cleanName,
      value,
      sourceBlockId,
      updatedAt: Date.now(),
    });

    this.notifySubscribers();
  }

  /**
   * Remove a symbol definition.
   */
  removeSymbol(name) {
    if (this.symbols.has(name)) {
      this.symbols.delete(name);
      this.notifySubscribers();
    }
  }

  /**
   * Get value of a symbol.
   */
  getSymbol(name) {
    const entry = this.symbols.get(name);
    return entry ? entry.value : undefined;
  }

  /**
   * Return a plain scope object for MathJS evaluation: { a: 5, b: 10 }
   */
  getScopeObject() {
    const scopeObj = {};
    this.symbols.forEach((entry, name) => {
      scopeObj[name] = entry.value;
    });
    return scopeObj;
  }

  /**
   * Register a listener for scope updates.
   */
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  notifySubscribers() {
    const scopeObj = this.getScopeObject();
    this.subscribers.forEach((cb) => {
      try {
        cb(scopeObj, this.symbols);
      } catch (e) {
        // Ignore subscriber errors
      }
    });
  }

  clear() {
    this.symbols.clear();
    this.notifySubscribers();
  }
}

export const scopeManager = new ScopeManager();
